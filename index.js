const express = require("express");
const app = express();
const compression = require("compression");
const bcrypt = require("./bcrypt");
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
            db.register(
                req.body.first,
                req.body.last,
                req.body.email,
                hash
            ).then(results => {
                req.session.id = results[0].id;
                req.session.first = results[0].first;
                res.json({
                    success: true
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

app.get("*", function(req, res) {
    if (!req.session.id && req.url !== "/welcome") {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
