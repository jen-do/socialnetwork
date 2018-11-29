const express = require("express");
const app = express();
const compression = require("compression");
const bcrypt = require("./bcrypt");
const csurf = require("csurf");
const db = require("./db");

app.use(express.static("./public"));
const cookieSession = require("cookie-session");
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

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
