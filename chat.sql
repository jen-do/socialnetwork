DROP TABLE IF EXISTS chat;


CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    sender INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
