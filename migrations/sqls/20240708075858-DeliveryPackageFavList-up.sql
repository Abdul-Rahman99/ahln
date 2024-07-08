/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS DP_Fav_List {
    id SERIAL PRIMARY KEY,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delivery_package_id VARCHAR(20) REFERENCES Delivery_Package(id),
    user_id VARCHAR(20) REFERENCES users(id) NOT NULL
}