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

-- Set the sequence for the id column to start from 100000
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
    next_id_formatted := LPAD(next_id::TEXT, 7, '1000001');  -- Changed padding to 6 digits
    
    -- Construct the vendor_id
    NEW.vendor_id := 'Vendor_' || current_year || '_V' || next_id_formatted;  -- Updated format
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Trigger to call the function before inserting a new row
CREATE TRIGGER set_vendor_id
BEFORE INSERT ON vendor
FOR EACH ROW
EXECUTE FUNCTION generate_vendor_id();
