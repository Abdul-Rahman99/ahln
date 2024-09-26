/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS offline_OTPs (
    id SERIAL PRIMARY KEY,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Locker1_list TEXT,
    Locker2_list TEXT,
    Locker3_list TEXT,
    box_id VARCHAR(20) REFERENCES Box(id) NOT NULL
);