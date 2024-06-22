-- Create the table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alt_phone VARCHAR(20),
    payment_method VARCHAR(50),
    box_info JSONB,
    gr VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer', 'super admin', 'vendor', 'operations')),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(20) UNIQUE,
);

-- Set the sequence for the id column to start from 100001
SELECT setval(pg_get_serial_sequence('users', 'id'), 1000000);

-- Function to generate the user_id
CREATE OR REPLACE FUNCTION generate_user_id() RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    next_id INTEGER;
    next_id_formatted TEXT;
BEGIN
    -- Get the current year in two-digit format
    current_year := to_char(CURRENT_DATE, 'YY');
    
    -- Get the next sequence value (user number)
    SELECT COALESCE(MAX(CAST(SUBSTRING(user_id FROM 11 FOR 7) AS INTEGER)), 0) + 1 INTO next_id FROM users;
    
    -- Format the next id as D1000002, D1000003, etc.
    next_id_formatted := LPAD(next_id::TEXT, 7, '1000001');
    
    -- Construct the user_id
    NEW.id := 'Ahln_' || current_year || '_U' || next_id_formatted;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before inserting a new row
CREATE TRIGGER set_user_id
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION generate_user_id();



-- Create the box table with serial id starting from a 6-digit number
CREATE TABLE IF NOT EXISTS box (
    id SERIAL PRIMARY KEY,
    compartments_number INTEGER DEFAULT 3,
    video_id INTEGER,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    compartment1 BOOLEAN DEFAULT true NOT NULL,
    compartment2 BOOLEAN DEFAULT true NOT NULL,
    compartment3 BOOLEAN DEFAULT true NOT NULL,
    box_id VARCHAR(20) UNIQUE
);

-- Set the sequence for the id column to start from 100001
SELECT setval(pg_get_serial_sequence('box', 'id'), 1000000);

-- Function to generate the box_id
CREATE OR REPLACE FUNCTION generate_box_id() RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    next_id INTEGER;
    next_id_formatted TEXT;
BEGIN
    -- Get the current year in two-digit format
    current_year := to_char(CURRENT_DATE, 'YY');
    
    -- Get the next sequence value (box number)
    SELECT COALESCE(MAX(CAST(SUBSTRING(box_id FROM 11 FOR 7) AS INTEGER)), 0) + 1 INTO next_id FROM box;
    
    -- Format the next id as D1000002, D1000003, etc.
    next_id_formatted := LPAD(next_id::TEXT, 7, '1000001');
    
    -- Construct the box_id
    NEW.box_id := 'Ahln_' || current_year || '_B' || next_id_formatted;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before inserting a new row
CREATE TRIGGER set_box_id
BEFORE INSERT ON box
FOR EACH ROW
EXECUTE FUNCTION generate_box_id();



-- Create the vendor table with serial id starting from a 6-digit number
CREATE TABLE IF NOT EXISTS vendor (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    address TEXT,
    url VARCHAR(255),
    api_ref VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    vendor_id VARCHAR(20) UNIQUE
    );


-- Set the sequence for the id column to start from 100001
SELECT setval(pg_get_serial_sequence('vendor', 'id'), 1000000);

-- Function to generate the vendor_id
CREATE OR REPLACE FUNCTION generate_vendor_id() RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    next_id INTEGER;
    next_id_formatted TEXT;
BEGIN
    -- Get the current year in two-digit format
    current_year := to_char(CURRENT_DATE, 'YY');
    
    -- Get the next sequence value (vendor number)
    SELECT COALESCE(MAX(CAST(SUBSTRING(vendor_id FROM 11 FOR 7) AS INTEGER)), 0) + 1 INTO next_id FROM vendor;
    
    -- Format the next id as D1000002, D1000003, etc.
    next_id_formatted := LPAD(next_id::TEXT, 7, '1000001');
    
    -- Construct the vendor_id
    NEW.vendor_id := 'Ahln_' || current_year || '_V' || next_id_formatted;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before inserting a new row
CREATE TRIGGER set_vendor_id
BEFORE INSERT ON vendor
FOR EACH ROW
EXECUTE FUNCTION generate_vendor_id();



-- Create the delivery table
CREATE TABLE IF NOT EXISTS delivery (
    id SERIAL PRIMARY KEY NOT NULL,
    bar_code VARCHAR(255),
    qr_code VARCHAR(255),
    tracking_number VARCHAR(255) NOT NULL,
    from_id INT,
    to_customer_id INT,
    delivered_date TIMESTAMP,
    delivered_status BOOLEAN,
    delivery_id VARCHAR(20) UNIQUE NOT NULL,
    transporter VARCHAR(20) CHECK (transporter IN ('amazon', 'fedex', 'talabat', 'dhl', 'alibaba', 'other')) NOT NULL,
    transporter_name VARCHAR(20),
    nickname VARCHAR(20),
    description VARCHAR(255),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Set the sequence for the id column to start from 100001
SELECT setval(pg_get_serial_sequence('delivery', 'id'), 1000000, true);

-- Function to generate the delivery_id
CREATE OR REPLACE FUNCTION generate_delivery_id() RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    next_id INTEGER;
    next_id_formatted TEXT;
BEGIN
    -- Get the current year in two-digit format
    current_year := to_char(CURRENT_DATE, 'YY');
    
    -- Get the next sequence value (delivery number)
    SELECT COALESCE(MAX(CAST(SUBSTRING(delivery_id FROM 11 FOR 7) AS INTEGER)), 0) + 1 INTO next_id FROM delivery;
    
    -- Format the next id as 1000001, 1000002, etc.
    next_id_formatted := LPAD(next_id::TEXT, 7, '1000001');
    
    -- Construct the delivery_id
    NEW.delivery_id := 'Ahln_' || current_year || '_D' || next_id_formatted;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before inserting a new row
CREATE TRIGGER set_delivery_id
BEFORE INSERT ON delivery
FOR EACH ROW
EXECUTE FUNCTION generate_delivery_id();



-- Create the delivery table
CREATE TABLE IF NOT EXISTS operations (
    id SERIAL PRIMARY KEY,
    delivery_id VARCHAR(20) UNIQUE NOT NULL,
    state_method VARCHAR(50) NOT NULL ,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    operations_id VARCHAR(20) NOT NULL UNIQUE
);


-- Set the sequence for the id column to start from 100001
SELECT setval(pg_get_serial_sequence('operations', 'id'), 1000000, true);

-- Function to generate the operations_id
CREATE OR REPLACE FUNCTION generate_operations_id() RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    next_id INTEGER;
    next_id_formatted TEXT;
BEGIN
    -- Get the current year in two-digit format
    current_year := to_char(CURRENT_DATE, 'YY');
    
    -- Get the next sequence value (operations number)
    SELECT COALESCE(MAX(CAST(SUBSTRING(operations_id FROM 8 FOR 7) AS INTEGER)), 0) + 1 INTO next_id FROM operations;
    
    -- Format the next id as 1000001, 1000002, etc.
    next_id_formatted := LPAD(next_id::TEXT, 7, '0');
    
    -- Construct the operations_id
    NEW.operations_id := 'Ahln_' || current_year || '_O' || next_id_formatted;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before inserting a new row
CREATE TRIGGER set_operations_id
BEFORE INSERT ON operations
FOR EACH ROW
EXECUTE FUNCTION generate_operations_id();

