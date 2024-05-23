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
    NEW.box_id := 'Ahln_' || current_year || '_D' || next_id_formatted;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before inserting a new row
CREATE TRIGGER set_box_id
BEFORE INSERT ON box
FOR EACH ROW
EXECUTE FUNCTION generate_box_id();
