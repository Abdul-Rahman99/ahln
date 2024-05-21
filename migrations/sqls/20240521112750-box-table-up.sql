-- Ensure the extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the box table
CREATE TABLE box (
    id UUID DEFAULT uuid_generate_v1() PRIMARY KEY NOT NULL,
    compartments_number INTEGER DEFAULT 3,
    compartments_status JSONB,
    video_id INTEGER,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
