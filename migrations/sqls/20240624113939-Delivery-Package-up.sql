CREATE TABLE IF NOT EXISTS Box_IMAGE (
    id SERIAL PRIMARY KEY,
    createdAt TIMESTAMP DEFAULT now() NOT NULL,
    updatedAt TIMESTAMP DEFAULT now() NOT NULL,
    box_id VARCHAR(20) REFERENCES Box(id),
    image TEXT,
    delivery_package_id INTEGER REFERENCES Delivery_Package(id)
);
