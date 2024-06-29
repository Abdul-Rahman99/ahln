CREATE TABLE IF NOT EXISTS Delivery_Package (
    id VARCHAR(20) PRIMARY KEY,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    customer_id VARCHAR(20) REFERENCES users(id),
    vendor_id VARCHAR(20) REFERENCES users(id),
    delivery_id VARCHAR(20) REFERENCES users(id),

    tracking_number VARCHAR(50),

    address_id INTEGER REFERENCES Address(id),
    shipping_company_id INTEGER NOT NULL REFERENCES Shipping_Company(id),
    box_id VARCHAR(20) REFERENCES Box(id),
    box_locker_id VARCHAR(20) REFERENCES Box_Locker(id),
    shipment_status TEXT NOT NULL,
    is_delivered BOOLEAN
);
