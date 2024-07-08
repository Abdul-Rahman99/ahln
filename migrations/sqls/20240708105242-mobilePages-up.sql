/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS Mobile_Pages (
    id SERIAL PRIMARY KEY,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL ,
    content_ar TEXT NOT NULL,
    content_en TEXT NOT NULL
);