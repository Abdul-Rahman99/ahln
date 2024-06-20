-- Create the Role table
CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description TEXT
);

-- Create the Permission table
CREATE TABLE IF NOT EXISTS permission (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description TEXT
);

-- Create the Role_Permission table
CREATE TABLE IF NOT EXISTS role_permission (
    role_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (permission_id) REFERENCES permission(id)
);

-- Create the User table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(20) UNIQUE NOT NULL PRIMARY KEY,
    role_id INTEGER NOT NULL,
    fcm_token VARCHAR(255) UNIQUE NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    prefered_language VARCHAR(20) ,    
    FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Create the User_Permission table
CREATE TABLE IF NOT EXISTS user_permission (
    user_id VARCHAR(20) NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (permission_id) REFERENCES permission(id)
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
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 11 FOR 7) AS INTEGER)), 0) + 1 INTO next_id FROM users;
    
    -- Format the next id as D1000002, D1000003, etc.
    next_id_formatted := LPAD(next_id::TEXT, 7, '0');
    
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
