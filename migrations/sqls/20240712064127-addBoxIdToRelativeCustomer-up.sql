/* Replace with your SQL commands */
ALTER TABLE Relative_Customer 
ADD COLUMN box_id VARCHAR(20) REFERENCES Box(id);