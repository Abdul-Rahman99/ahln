-- Ensure the extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- Create the table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v1() PRIMARY KEY NOT NULL,
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
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

