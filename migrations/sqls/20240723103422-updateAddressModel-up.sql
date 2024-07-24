/* Replace with your SQL commands */
ALTER TABLE Address ADD COLUMN user_id VARCHAR(20) REFERENCES users;
