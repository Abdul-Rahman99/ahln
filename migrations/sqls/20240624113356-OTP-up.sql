CREATE TABLE IF NOT EXISTS OTP (
    id SERIAL PRIMARY KEY,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    box_id VARCHAR(20) REFERENCES Box(id),
    box_locker_id INTEGER REFERENCES Box_Locker(id),
    is_used BOOLEAN
);