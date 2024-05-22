-- Ensure the extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the box table
CREATE TABLE box (
    id UUID DEFAULT uuid_generate_v1() PRIMARY KEY NOT NULL,
    -- serial_id  , // needs to be reconsidered
    compartments_number INTEGER DEFAULT 3 CHECK (compartments_number IN (1, 2, 3)),
    compartment1 BOOLEAN ,
    compartment2 BOOLEAN ,
    compartment3 BOOLEAN ,
    video_id INTEGER,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
