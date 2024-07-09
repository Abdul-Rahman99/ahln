/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS Contact_Us (
    id SERIAL PRIMARY KEY,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(50) NOT NULL,
    mobile_number VARCHAR(20),
    message TEXT NOT NULL,
    created_by VARCHAR(20) REFERENCES users(id)
);