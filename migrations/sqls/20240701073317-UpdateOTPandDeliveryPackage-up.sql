/* Replace with your SQL commands */
ALTER TABLE Delivery_Package
ALTER COLUMN id TYPE VARCHAR(60);

ALTER TABLE OTP
ALTER COLUMN delivery_package_id TYPE VARCHAR(60);