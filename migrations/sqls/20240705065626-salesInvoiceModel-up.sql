/* Replace with your SQL commands */
/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS sales_invoice (
    id VARCHAR(60) PRIMARY KEY,
    customer_id VARCHAR(20) REFERENCES users(id) NOT NULL,
    box_id VARCHAR(20) REFERENCES Box(id) NOT NULL,
    purchase_date DATE NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sales_id VARCHAR(20) REFERENCES users(id) NOT NULL
);
