/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS sales_invoice (
    id VARCHAR(60) PRIMARY KEY,
    customer_id VARCHAR(20) REFERENCES users(id),
    box_id VARCHAR(20) REFERENCES Box(id),
    purchase_date DATE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sales_id VARCHAR(20) REFERENCES users(id)
);
