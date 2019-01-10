const knox = require("knox");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // otherwise the secrets are stored in secrets.json
}

const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: "spicedling"
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        return res.sendStatus(500);
    }

    // configuring the request to AWS
    const s3Request = client.put(req.file.filename, {
        "Content-Type": req.file.mimetype,
        "Content-Length": req.file.size,
        "x-amz-acl": "public-read"
    });
    // sending the request to AWS
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    // now listening for response from AWS
    s3Request.on("response", s3Response => {
        // was Sussessful will be true if statuscode = 200
        console.log("status code of response: ", s3Response.statusCode);
        const wasSuccessful = s3Response.statusCode == 200;
        if (wasSuccessful) {
            next();
        } else {
            res.sendStatus(500);
        }
    });
};

exports.delete = function(req, res, next) {
    client
        .del(req.body.amazonString)
        .on("response", function(res) {
            console.log(res.statusCode);
            console.log(res.headers);
            next();
        })
        .end();
};
