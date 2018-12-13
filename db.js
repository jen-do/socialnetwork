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
        })
        .catch(err => {
            console.log("error in db inserting new user: ", err);
        });
};

exports.login = function(email) {
    return db
        .query(
            `
        SELECT * FROM users
        WHERE email = $1
        `,
            [email]
        )
        .then(results => {
            return results.rows;
        });
};

exports.getUserInfo = function(id) {
    return db
        .query(
            `SELECT * FROM users
        WHERE id = $1`,
            [id]
        )
        .then(results => {
            return results.rows;
        });
};

exports.uploadProfilePic = function(id, profilePic) {
    return db
        .query(
            `UPDATE users
            SET image = $2
            WHERE id = $1
            RETURNING image AS url`,
            [id, profilePic]
        )
        .then(results => {
            return results.rows;
        });
};

exports.setBio = function(id, bio) {
    return db
        .query(
            `UPDATE users
            SET bio = $2
            WHERE id = $1
            RETURNING bio`,
            [id, bio]
        )
        .then(results => {
            return results.rows;
        });
};

exports.getOtherProfiles = function(id) {
    return db
        .query(
            `SELECT * FROM users
        WHERE id = $1`,
            [id]
        )
        .then(results => {
            console.log("results from db", results);
            return results.rows;
        });
};

exports.checkFriendship = function(user_one, user_two) {
    return db
        .query(
            `SELECT * FROM friendships
            WHERE (receiver = $1 AND sender = $2)
            OR (receiver = $2 AND sender = $1)`,
            [user_one, user_two]
        )
        .then(results => {
            return results.rows;
        });
};

exports.makeFriendRequest = function(receiver, sender) {
    return db
        .query(
            `INSERT INTO friendships (receiver, sender)
            VALUES ($1, $2)
            RETURNING receiver, sender, accepted`,
            [receiver || null, sender || null]
        )
        .then(results => {
            return results.rows;
        });
};

exports.acceptFriendRequest = function(receiver, sender) {
    return db
        .query(
            `UPDATE friendships
            SET accepted = true
            WHERE receiver = $1 AND sender = $2
            RETURNING receiver, sender, accepted`,
            [receiver, sender]
        )
        .then(results => {
            return results.rows;
        });
};

exports.endFriendship = function(user_one, user_two) {
    return db
        .query(
            `DELETE FROM friendships
            WHERE (receiver = $1 AND sender = $2)
            OR (receiver = $2 AND sender = $1)`,
            [user_one, user_two]
        )
        .then(results => {
            return results.rows;
        });
};

exports.getFriendsAndWannabes = function(id) {
    return db
        .query(
            `
            SELECT users.id, first, last, image, accepted
            FROM friendships
            JOIN users
            ON (accepted = false AND receiver = $1 AND sender = users.id)
            OR (accepted = true AND receiver = $1 AND sender = users.id)
            OR (accepted = true AND sender = $1 AND receiver = users.id)
            `,
            [id]
        )
        .then(results => {
            return results.rows;
        });
};

exports.getUsersByIds = function(arrayOfIds) {
    const query = `SELECT id, first, last, image FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

exports.getUserWhoJoined = function(id) {
    return db
        .query(
            `
        SELECT id, first, last, image
        FROM users
        WHERE id = $1`,
            [id]
        )
        .then(results => {
            return results.rows;
        });
};

exports.getChatMessages = function() {
    return db
        .query(
            `
        SELECT chat.id, chat.message, users.first, users.last, users.image
        FROM chat
        LEFT JOIN users
        ON chat.sender = users.id
        ORDER BY chat.id DESC
        LIMIT 10`
        )
        .then(results => {
            return results.rows;
        });
};

exports.addNewMessage = function(message, sender) {
    return db
        .query(
            `
        INSERT INTO chat (message, sender)
        VALUES ($1, $2)
        RETURNING id, message, sender
        `,
            [message || null, sender || null]
        )
        .then(results => {
            return results.rows;
        });
};

exports.getSenderInfo = function(id) {
    return db
        .query(
            `
        SELECT first, last, image
        FROM users
        WHERE id = $1
        `,
            [id]
        )
        .then(results => {
            return results.rows;
        });
};

exports.deleteAccountFromChat = function(id) {
    return db
        .query(
            `DELETE FROM chat
            WHERE sender = $1`,
            [id]
        )
        .then(function() {
            return;
        });
};

exports.deleteAccountFromFriendships = function(id) {
    return db
        .query(
            `DELETE FROM friendships
            WHERE receiver = $1
            OR sender = $1`,
            [id]
        )
        .then(function() {
            return;
        });
};

exports.deleteAccountFromUsers = function(id) {
    return db
        .query(
            `DELETE FROM users
            WHERE id = $1`,
            [id]
        )
        .then(function() {
            return;
        });
};
