DROP TABLE IF EXISTS chat;

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    message VARCHAR(500) NOT NULL,
    sender INTEGER NOT NULL REFERENCES users(id)
);