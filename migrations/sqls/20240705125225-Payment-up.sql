/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS card (
    id SERIAL PRIMARY KEY,
    card_number TEXT NOT NULL UNIQUE,
    expire_date DATE NOT NULL,
    cvv VARCHAR(3) NOT NULL,
    name_on_card TEXT NOT NULL,
    billing_address INTEGER REFERENCES Address(id),
    user_id VARCHAR(20) REFERENCES users(id) NOT NULL
);