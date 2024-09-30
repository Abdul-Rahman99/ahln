/* Replace with your SQL commands */
/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS Relative_Customer_Access (
    id SERIAL PRIMARY KEY,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    customer_id VARCHAR(20) REFERENCES users(id) NOT NULL,
    relative_customer_id VARCHAR(20) REFERENCES users(id) NOT NULL,
    box_id VARCHAR(20) REFERENCES Box(id) NOT NULL,

    add_shipment BOOLEAN NOT NULL DEFAULT false,
    read_owner_shipment BOOLEAN NOT NULL DEFAULT false,
    read_own_shipment BOOLEAN NOT NULL DEFAULT false,

    create_pin BOOLEAN NOT NULL DEFAULT false ,
    create_offline_otps BOOLEAN NOT NULL DEFAULT false,
    create_otp BOOLEAN NOT NULL DEFAULT false,

    open_door1 BOOLEAN NOT NULL DEFAULT false,
    open_door2 BOOLEAN NOT NULL DEFAULT false,
    open_door3 BOOLEAN NOT NULL DEFAULT false,

    read_playback BOOLEAN NOT NULL DEFAULT false,
    read_notification BOOLEAN NOT NULL DEFAULT false,

    craete_realative_customer BOOLEAN NOT NULL DEFAULT false,

    transfer_box_ownership BOOLEAN NOT NULL DEFAULT false,
    read_history BOOLEAN NOT NULL DEFAULT false,

    update_box_screen_message BOOLEAN NOT NULL DEFAULT false,

    read_live_stream BOOLEAN NOT NULL DEFAULT false,

    update_box_data BOOLEAN NOT NULL DEFAULT false
    );