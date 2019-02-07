// ---------- requiring servers
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

// ---------- requiring other packages and serverside files
const compression = require("compression");
const bcrypt = require("./bcrypt");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3.js");
const moment = require("moment");
const db = require("./db");

// ---------- middleware
app.use(express.static("./public"));
app.use(express.static("./uploads"));

const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
// making session data from cookieSession available to the server-side socket:
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

const bodyparser = require("body-parser");
app.use(bodyparser.json());

// file upload
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

app.post("/registration", async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.pass);
        const results = await db.register(
            req.body.first,
            req.body.last,
            req.body.email,
            hash
        );
        req.session.id = results[0].id;
        req.session.first = results[0].first;
        res.json({
            success: true
        });
    } catch (err) {
        console.log("error in POST /registration: ", err);
        res.json({
            success: false
        });
    }
});

// login - checking 1) if email is registered, 2) if passwords do match
app.post("/login", async (req, res) => {
    try {
        const results = await db.login(req.body.email);
        if (results.length == 0) {
            throw new Error("no such email registered");
        } else {
            const matches = await bcrypt.compare(
                req.body.pass,
                results[0].pass
            );
            if (matches) {
                console.log("passwords do match");
                req.session.id = results[0].id;
                req.session.first = results[0].first;
                res.json({
                    success: true
                });
            } else {
                console.log("password do not match");
                res.json({
                    success: false
                });
            }
        }
    } catch (err) {
        console.log("error in POST /login: ", err);
        res.json({
            success: false
        });
    }
});

//////////////// profile / bio routes ////////////////

// profile
app.get("/user", (req, res) => {
    db.getUserInfo(req.session.id)
        .then(results => {
            res.json(results[0]);
        })
        .catch(err => {
            console.log("error in GET /user serverside: ", err);
        });
});

// image upload
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    db.uploadProfilePic(
        req.session.id,
        "https://s3.amazonaws.com/spicedling/" + req.file.filename
    )
        .then(results => {
            req.session.image = results[0].url;
            res.json({
                image: results[0].url,
                success: true
            });
        })
        .catch(err => {
            console.log("error in POST /uploads: ", err);
            res.json({
                success: false
            });
        });
});

// image and account deletion
app.post("/deleteimage", s3.delete, (req, res) => {
    console.log("image deleted");
    res.sendStatus(200);
});

app.post("/deleteaccount/:id", (req, res) => {
    Promise.all([
        db.deleteAccountFromChat(req.params.id),
        db.deleteAccountFromFriendships(req.params.id)
    ])
        .then(
            db.deleteAccountFromUsers(req.params.id),
            res.json({
                deleted: true
            }),
            console.log("account deleted")
        )
        .catch(err => {
            console.log("error in /deleteaccount serverside:", err);
        });
});

// adding and updating own bio
app.post("/bio", (req, res) => {
    db.setBio(req.session.id, req.body.bio)
        .then(results => {
            res.json({
                bio: results[0].bio,
                success: true
            });
        })
        .catch(err => {
            console.log("error in updating bio: ", err);
            res.json({
                success: false
            });
        });
});

//////// routes for other users' profiles + user search ////////

// viewing other users' profile pages
app.get("/user/:id/profile", (req, res) => {
    if (req.params.id == req.session.id) {
        res.redirect("/");
    } else {
        db.getOtherProfiles(req.params.id)
            .then(results => {
                res.json({
                    results: results,
                    success: true
                });
            })
            .catch(err => {
                console.log("error in getting other person's profile: ", err);
                res.json({
                    success: false
                });
            });
    }
});

// search for other users on the network
app.get("/search/:username", (req, res) => {
    db.searchUsers(req.params.username, req.session.id)
        .then(results => {
            console.log("results in search", results);
            if (!results.length > 0) {
                res.json({
                    results: results,
                    noSearchResults: true
                });
            } else {
                res.json({
                    results: results,
                    noSearchResults: false
                });
            }
        })
        .catch(err => {
            console.log("err in /search serverside: ", err);
        });
});

//////////////// friendship button routes ////////////////

app.get("/friends/:id", (req, res) => {
    db.checkFriendship(req.params.id, req.session.id)
        .then(results => {
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
            console.log("error in POST /makeFriendRequest serverside:", err);
        });
});

app.post("/acceptfriendrequest/:id", (req, res) => {
    db.acceptFriendRequest(req.session.id, req.params.id)
        .then(results => {
            res.json(results[0]);
        })
        .catch(err => {
            console.log("error in POST /acceptFriendRequest serverside:", err);
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
            console.log("error in POST /endFrienship serverside:", err);
        });
});

//////////////// redux: friends + wannabes ///////

app.get("/listfriendsandwannabes", (req, res) => {
    db.getFriendsAndWannabes(req.session.id)
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            console.log("error in /getFriendsAndWannabes serverside:", err);
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

// server will listen for both HTTP and sockets requests
server.listen(8080, function() {
    console.log("I'm listening.");
});

// ---------- server-side socket code:

//////////////// who's online now ////////////////

// onlineUsers contains a list of everyone currently online (their socket.id : their userId)
let onlineUsers = {};

io.on("connection", socket => {
    // console.log(`user with socket id ${socket.id} just connected`);
    let socketId = socket.id;
    let userId = socket.request.session.id;
    onlineUsers[socketId] = userId;

    // extracting the userIds from onlineUsers for the following DB queries
    let arrayOfIds = Object.values(onlineUsers);

    // get list of all users currently online
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

    // updating the list of online users when a new person logs in
    console.log("ID of the user who joined", arrayOfIds.slice(-1)[0]);
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

    // updating the list of online users when a person logs out
    socket.on("disconnect", function() {
        delete onlineUsers[socket.id];
        if (!Object.values(onlineUsers).includes(userId)) {
            io.sockets.emit("userLeft", userId);
        }
    });

    //////////////// chat ////////////////

    // get chat messages / timestamp formatting with moment.js
    db.getChatMessages()
        .then(lastTenChatMessages => {
            lastTenChatMessages.map(message => {
                message.createdAt = moment(message.created_at).fromNow();
                // console.log("each message", message.createdAt);
                return message;
            });
            io.sockets.emit("getChatMessages", lastTenChatMessages);
        })
        .catch(err => {
            console.log("error in getChatMessages serverside:", err);
        });

    // add a message to the chat / timestamp formating with moment.js
    socket.on("newMessage", message => {
        Promise.all([
            db.addNewMessage(message, userId),
            db.getSenderInfo(userId)
        ])
            .then(results => {
                results[0].map(message => {
                    message.created_at = moment(message.created_at).fromNow();
                    return message;
                });

                let chatInfo = {
                    id: results[0][0].id,
                    message: results[0][0].message,
                    sender: results[0][0].sender,
                    createdAt: results[0][0].created_at,
                    first: results[1][0].first,
                    last: results[1][0].last,
                    image: results[1][0].image
                };

                io.sockets.emit("addNewMessage", chatInfo);
            })
            .catch(err => {
                console.log(
                    "error in adding a new chat message serverside:",
                    err
                );
            });
    });
});
