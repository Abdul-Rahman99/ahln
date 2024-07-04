-- Dropping the column box_locker_string
ALTER TABLE OTP
DROP COLUMN box_locker_string;

-- Setting the box_id column to NOT NULL
ALTER TABLE OTP
ALTER COLUMN box_id SET NOT NULL;

-- Adding the foreign key constraint to the box_id column
ALTER TABLE OTP
ADD CONSTRAINT fk_box_id FOREIGN KEY (box_id) REFERENCES Box(id);
