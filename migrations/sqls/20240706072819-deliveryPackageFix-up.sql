/* Replace with your SQL commands */

ALTER TABLE Delivery_Package ALTER COLUMN shipping_company_id drop not null;
ALTER TABLE Delivery_Package ADD other_shipping_company VARCHAR(50); 