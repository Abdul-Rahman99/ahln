/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS Versions (
    id SERIAL PRIMARY KEY,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IOS TEXT NOT NULL,
    Android TEXT NOT NULL
);