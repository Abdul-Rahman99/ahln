CREATE TABLE IF NOT EXISTS Box (
    id VARCHAR(20) UNIQUE NOT NULL PRIMARY KEY,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    box_label VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    has_empty_lockers BOOLEAN,
    current_tablet_id INTEGER REFERENCES Tablet(id),
    previous_tablet_id INTEGER REFERENCES Tablet(id),
    box_model_id VARCHAR(20) REFERENCES Box_Model(id),
    address_id INTEGER REFERENCES Address(id)
);

CREATE TABLE IF NOT EXISTS Box_Locker (
    id SERIAL PRIMARY KEY,
    locker_label VARCHAR(50) UNIQUE NOT NULL,
    serial_port VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_empty BOOLEAN,
    box_id VARCHAR(20) REFERENCES Box(id)
);
