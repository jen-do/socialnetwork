const express = require("express");
const app = express();
const server = require("http").Server(app); // creates an HTTP server and passing it the app express-server, wraps the express-server (express will listen for get and post requests, socket listens for socket requests)
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");
const bcrypt = require("./bcrypt");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3.js");
const db = require("./db");

app.use(express.static("./public"));
app.use(express.static("./uploads"));
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
// this passes the cookieSession info to server-side socket, so socket has access to session data
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
const bodyparser = require("body-parser");
app.use(bodyparser.json());

// boilerplate for file upload
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
// end boilerplate file upload

// csurf comes after bodyPrser and cookieSession
app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//////////////// register + login routes ////////////////

app.post("/registration", (req, res) => {
    // console.log("req.body in /registration: ", req.body);
    bcrypt
        .hash(req.body.pass)
        .then(hash => {
            db.register(req.body.first, req.body.last, req.body.email, hash)
                .then(results => {
                    console.log(results);
                    req.session.id = results[0].id;
                    req.session.first = results[0].first;
                    res.json({
                        success: true
                    });
                })
                .catch(err => {
                    console.log("error in POST /registration: ", err);
                    res.json({
                        success: false
                    });
                });
        })
        .catch(err => {
            console.log("error in POST /registration: ", err);
            res.json({
                success: false
            });
        });
});

app.post("/login", (req, res) => {
    console.log(req.body);
    db.login(req.body.email)
        .then(results => {
            if (results.length == 0) {
                throw new Error("no such email registered");
            }
            bcrypt
                .compare(req.body.pass, results[0].pass)
                .then(matches => {
                    if (matches) {
                        console.log("passwords do match");
                        req.session.id = results[0].id;
                        req.session.first = results[0].first;
                        console.log("sessioncookie login", req.session.id);
                        res.json({
                            success: true
                        });
                    } else {
                        res.json({
                            success: false
                        });
                    }
                })
                .catch(err => {
                    console.log("error in POST /login: ", err);
                    res.json({
                        success: false
                    });
                });
        })
        .catch(err => {
            console.log("error in POST /login: ", err);
            res.json({
                success: false
            });
        });
});

//////////////// profile / bio routes ////////////////

app.get("/user", (req, res) => {
    db.getUserInfo(req.session.id)
        .then(results => {
            // console.log("results in getUserinfo: ", results);
            res.json(results[0]);
        })
        .catch(err => {
            console.log("error in GET /user serverside: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.file in POST /upload", req.file, req.body);
    db.uploadProfilePic(
        req.session.id,
        "https://s3.amazonaws.com/spicedling/" + req.file.filename
    )
        .then(results => {
            console.log(results[0].url);
            res.json({
                image: results[0].url,
                success: true
            });
        })
        .catch(err => {
            console.log("error in POST /uploads if statement: ", err);
            res.json({
                success: false
            });
        });
});

app.post("/bio", (req, res) => {
    console.log(req.body);
    db.setBio(req.session.id, req.body.bio)
        .then(results => {
            // console.log("results in updating bio in db: ", results);
            res.json({
                bio: results[0].bio,
                success: true
            });
        })
        .catch(err => {
            console.log("error in updating bio in db : ", err);
            res.json({
                success: false
            });
        });
});

app.get("/user/:id/profile", (req, res) => {
    // console.log("req.params.id in GET opp:", req.params.id);
    if (req.params.id == req.session.id) {
        res.redirect("/");
    } else {
        db.getOtherProfiles(req.params.id)
            .then(results => {
                // console.log("results in getOtherProfiles:", results[0]);
                res.json({
                    results: results,
                    success: true
                });
            })
            .catch(err => {
                console.log("error in getting other peoples profiles: ", err);
                res.json({
                    success: false
                });
            });
    }
});

//////////////// friendship button routes ////////////////

app.get("/friends/:id", (req, res) => {
    db.checkFriendship(req.params.id, req.session.id)
        .then(results => {
            // console.log("results in GET checkFrienship serverside: ", results);
            if (!results.length > 0) {
                res.json({
                    noRelationship: true
                });
            } else {
                res.json(results[0]);
            }
        })
        .catch(err => {
            console.log("error in GET checkfrienship serverside:", err);
        });
});

app.post("/friendrequest/:id", (req, res) => {
    db.makeFriendRequest(req.params.id, req.session.id)
        .then(results => {
            res.json(results[0]);
        })
        .catch(err => {
            console.log("error in POST makeFriendRequest serverside:", err);
        });
});

app.post("/acceptfriendrequest/:id", (req, res) => {
    db.acceptFriendRequest(req.session.id, req.params.id)
        .then(results => {
            // console.log(results);
            res.json(results[0]);
        })
        .catch(err => {
            console.log("error in POST acceptFriendRequest serverside:", err);
        });
});

app.post("/endfriendship/:id", (req, res) => {
    db.endFriendship(req.session.id, req.params.id)
        .then(results => {
            res.json({
                noRelationship: true,
                otherUser: req.params.id,
                accepted: false
            });
        })
        .catch(err => {
            console.log("error in POST endFrienship serverside:", err);
        });
});

//////////////// redux: friends + wannabes ///////

app.get("/listfriendsandwannabes", (req, res) => {
    db.getFriendsAndWannabes(req.session.id)
        .then(results => {
            console.log("results in getFriendsAndWannabes serverside", results);
            res.json(results);
        })
        .catch(err => {
            console.log("error in getFriendsAndWannabes serverside:", err);
        });
});

//////////////// redirect routes ////////////////

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome#/login");
});

app.get("/welcome", function(req, res) {
    if (req.session.id && req.url == "/welcome") {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function(req, res) {
    if (!req.session.id && req.url == "/") {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
}); // server will listen for both HTTP and sockets requests

/////////////////////////////////////////////////////////////////////////////
////////// put all of server-side socket code below server.listen ///////////
/////////////////////////////////////////////////////////////////////////////

// onlineUsers obj will be responsible for maintaining a list of everyone who's currently online - left socketId, right userId
let onlineUsers = {};

io.on("connection", socket => {
    console.log(`user with socket id ${socket.id} just connected`);
    let socketId = socket.id;
    let userId = socket.request.session.id;
    onlineUsers[socketId] = userId;
    console.log("onlineUsers: ", onlineUsers);

    let arrayOfIds = Object.values(onlineUsers); // will extract every value from onlineUsers and store it in an array
    console.log("arrayOfIds", arrayOfIds);

    db.getUsersByIds(arrayOfIds)
        .then(results => {
            socket.emit("onlineUsers", results.rows);
        })
        .catch(err => {
            console.log(
                "error in serverside socket db query getUsersByIds",
                err
            );
        });

    console.log("ID of user just joined", arrayOfIds.slice(-1)[0]);

    if (arrayOfIds.indexOf(userId) == arrayOfIds.length - 1) {
        var newUser = arrayOfIds.slice(-1)[0];
        db.getUserWhoJoined(newUser)
            .then(results => {
                socket.broadcast.emit("userJoined", results);
            })
            .catch(err => {
                console.log("error in getUserWhoJoined", err);
            });
    }

    socket.on("disconnect", function() {
        delete onlineUsers[socket.id];
        // console.log(`socket with id ${socket.id} just disconnected`, userId);
        if (!Object.values(onlineUsers).includes(userId)) {
            io.sockets.emit("userLeft", userId);
        }
    });

    // chat - data flow #1
    db.getChatMessages()
        .then(lastTenChatMessages => {
            // console.log("results from db query chat:", lastTenChatMessages);
            io.sockets.emit("getChatMessages", lastTenChatMessages);
        })
        .catch(err => {
            console.log("error in getChatMessages in index.js:", err);
        });

    // chat - data flow #2
    socket.on("newMessage", message => {
        Promise.all([
            db.addNewMessage(message, userId),
            db.getSenderInfo(userId)
        ])
            .then(results => {
                let chatInfo = {
                    id: results[0][0].id,
                    message: results[0][0].message,
                    sender: results[0][0].sender,
                    first: results[1][0].first,
                    last: results[1][0].last,
                    image: results[1][0].image
                };
                console.log("chatInfo", chatInfo);
                io.sockets.emit("addNewMessage", chatInfo);
            })
            .catch(err => {
                console.log("error in addChatMessage in index.js:", err);
            });
    });

    // send message from server to client, pass emit() 2 arguments: 1) name of message, 2) any data we want to send as part of the message (data can be any result from db query, API query, normal array, obj, string, int ...):
    // db.getUser(userId).then(results => {
    //     socket.emit("catnip", result);
    // });
});
