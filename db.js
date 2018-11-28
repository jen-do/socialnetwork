const spicedPg = require("spiced-pg");

var db = spicedPg(`postgres:postgres:postgres@localhost:5432/socialnetwork`);

exports.register = function(first, last, email, hash) {
    return db
        .query(
            `INSERT INTO users (first, last, email, pass)
            VALUES ($1, $2, $3, $4)
            RETURNING id, first`,
            [first || null, last || null, email || null, hash || null]
    )
    .then(results => {
        return results.rows;
    });
};
