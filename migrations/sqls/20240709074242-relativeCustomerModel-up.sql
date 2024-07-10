/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS Relative_Customer(
    id SERIAL PRIMARY KEY,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    customer_id VARCHAR(20) REFERENCES users(id) NOT NULL,
    relative_customer_id VARCHAR(20) REFERENCES users(id) NOT NULL,
    relation TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true
);