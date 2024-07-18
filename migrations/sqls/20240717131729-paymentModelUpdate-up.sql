/* Replace with your SQL commands */

ALTER TABLE payment ADD COLUMN customer_id VARCHAR(20) REFERENCES users;
ALTER TABLE payment ADD COLUMN sales_id VARCHAR(20) REFERENCES users;
