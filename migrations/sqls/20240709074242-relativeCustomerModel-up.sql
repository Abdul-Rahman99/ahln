/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS Relative_Customer(
    id SERIAL PRIMARY KEY,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    customer_id VARCHAR(20) REFERENCES users(id) NOT NULL,
    relation TEXT,
    email VARCHAR(50) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    box_id VARCHAR(20) REFERENCES Box(id) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);