/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS PIN (
    id SERIAL PRIMARY KEY ,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reciepent_email VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    time_range TEXT NOT NULL,
    day_range TEXT NOT NULL,
    box_id VARCHAR(20) REFERENCES Box(id) NOT NULL,
    user_id VARCHAR(20) REFERENCES users(id) NOT NULL,
    type VARCHAR(50) NOT NULL,
    passcode TEXT NOT NULL
);