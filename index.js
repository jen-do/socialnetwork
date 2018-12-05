const express = require("express");
const app = express();
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
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

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
                ...results[0]
            });
        })
        .catch(err => {
            console.log("error in POST endFrienship serverside:", err);
        });
});

//////////////// redirect routes ////////////////

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

app.listen(8080, function() {
    console.log("I'm listening.");
});
