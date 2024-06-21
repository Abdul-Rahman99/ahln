-- Create the Role table
CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description TEXT
);

INSERT INTO role (id, title, description) VALUES
(1, 'system_admin', 'System Administrator role with full access to the system.'),
(2, 'customer', 'Customer role with access to customer-related features.'),
(3, 'relative_customer', 'Relative of a customer with limited access.'),
(4, 'operation_manager', 'Operations Manager role responsible for overseeing operations.'),
(5, 'operation_member', 'Operations team member with access to operational tasks.'),
(6, 'sales_manager', 'Sales Manager role overseeing the sales team.'),
(7, 'sales_member', 'Sales team member involved in sales activities.'),
(8, 'technical_manager', 'Technical Manager role overseeing technical operations.'),
(9, 'technical_member', 'Technical team member involved in technical tasks.');

-- Create the Permission table
CREATE TABLE IF NOT EXISTS permission (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL, 
    description TEXT
);

-- Insert data into Permission table for the specified entities
INSERT INTO permission (id, title, description) VALUES
-- Users
(1, 'create_user', 'Permission to create a new user'),
(2, 'read_user', 'Permission to read user information'),
(3, 'update_user', 'Permission to update user information'),
(4, 'delete_user', 'Permission to delete a user'),
-- Role
(5, 'create_role', 'Permission to create a new role'),
(6, 'read_role', 'Permission to read role information'),
(7, 'update_role', 'Permission to update role information'),
(8, 'delete_role', 'Permission to delete a role'),
-- Permission
(9, 'create_permission', 'Permission to create a new permission'),
(10, 'read_permission', 'Permission to read permission information'),
(11, 'update_permission', 'Permission to update permission information'),
(12, 'delete_permission', 'Permission to delete a permission'),
-- User Permission
(13, 'create_user_permission', 'Permission to create a new user permission'),
(14, 'read_user_permission', 'Permission to read user permission information'),
(15, 'update_user_permission', 'Permission to update user permission information'),
(16, 'delete_user_permission', 'Permission to delete a user permission'),
-- Role Permission
(17, 'create_role_permission', 'Permission to create a new role permission'),
(18, 'read_role_permission', 'Permission to read role permission information'),
(19, 'update_role_permission', 'Permission to update role permission information'),
(20, 'delete_role_permission', 'Permission to delete a role permission'),
-- Tablet
(21, 'create_tablet', 'Permission to create a new tablet'),
(22, 'read_tablet', 'Permission to read tablet information'),
(23, 'update_tablet', 'Permission to update tablet information'),
(24, 'delete_tablet', 'Permission to delete a tablet'),
-- Box
(25, 'create_box', 'Permission to create a new box'),
(26, 'read_box', 'Permission to read box information'),
(27, 'update_box', 'Permission to update box information'),
(28, 'delete_box', 'Permission to delete a box'),
-- Ticket Room
(29, 'create_ticket_room', 'Permission to create a new ticket room'),
(30, 'read_ticket_room', 'Permission to read ticket room information'),
(31, 'update_ticket_room', 'Permission to update ticket room information'),
(32, 'delete_ticket_room', 'Permission to delete a ticket room'),
-- Message
(33, 'create_message', 'Permission to create a new message'),
(34, 'read_message', 'Permission to read message information'),
(35, 'update_message', 'Permission to update message information'),
(36, 'delete_message', 'Permission to delete a message'),
-- Audit Trail
(37, 'create_audit_trail', 'Permission to create a new audit trail'),
(38, 'read_audit_trail', 'Permission to read audit trail information'),
(39, 'update_audit_trail', 'Permission to update audit trail information'),
(40, 'delete_audit_trail', 'Permission to delete an audit trail'),
-- Notification
(41, 'create_notification', 'Permission to create a new notification'),
(42, 'read_notification', 'Permission to read notification information'),
(43, 'update_notification', 'Permission to update notification information'),
(44, 'delete_notification', 'Permission to delete a notification'),
-- MQTT Topic
(45, 'create_mqtt_topic', 'Permission to create a new MQTT topic'),
(46, 'read_mqtt_topic', 'Permission to read MQTT topic information'),
(47, 'update_mqtt_topic', 'Permission to update MQTT topic information'),
(48, 'delete_mqtt_topic', 'Permission to delete an MQTT topic'),
-- MQTT Log
(49, 'create_mqtt_log', 'Permission to create a new MQTT log'),
(50, 'read_mqtt_log', 'Permission to read MQTT log information'),
(51, 'update_mqtt_log', 'Permission to update MQTT log information'),
(52, 'delete_mqtt_log', 'Permission to delete an MQTT log'),
-- Service
(53, 'create_service', 'Permission to create a new service'),
(54, 'read_service', 'Permission to read service information'),
(55, 'update_service', 'Permission to update service information'),
(56, 'delete_service', 'Permission to delete a service'),
-- Card
(57, 'create_card', 'Permission to create a new card'),
(58, 'read_card', 'Permission to read card information'),
(59, 'update_card', 'Permission to update card information'),
(60, 'delete_card', 'Permission to delete a card'),
-- Payment
(61, 'create_payment', 'Permission to create a new payment'),
(62, 'read_payment', 'Permission to read payment information'),
(63, 'update_payment', 'Permission to update payment information'),
(64, 'delete_payment', 'Permission to delete a payment'),
-- User Box
(65, 'create_user_box', 'Permission to create a new user box'),
(66, 'read_user_box', 'Permission to read user box information'),
(67, 'update_user_box', 'Permission to update user box information'),
(68, 'delete_user_box', 'Permission to delete a user box'),
-- Address
(69, 'create_address', 'Permission to create a new address'),
(70, 'read_address', 'Permission to read address information'),
(71, 'update_address', 'Permission to update address information'),
(72, 'delete_address', 'Permission to delete an address'),
-- OTP
(73, 'create_otp', 'Permission to create a new OTP'),
(74, 'read_otp', 'Permission to read OTP information'),
(75, 'update_otp', 'Permission to update OTP information'),
(76, 'delete_otp', 'Permission to delete an OTP'),
-- Delivery Package
(77, 'create_delivery_package', 'Permission to create a new delivery package'),
(78, 'read_delivery_package', 'Permission to read delivery package information'),
(79, 'update_delivery_package', 'Permission to update delivery package information'),
(80, 'delete_delivery_package', 'Permission to delete a delivery package'),
-- Shipping Company
(81, 'create_shipping_company', 'Permission to create a new shipping company'),
(82, 'read_shipping_company', 'Permission to read shipping company information'),
(83, 'update_shipping_company', 'Permission to update shipping company information'),
(84, 'delete_shipping_company', 'Permission to delete a shipping company'),
-- Box Locker
(85, 'create_box_locker', 'Permission to create a new box locker'),
(86, 'read_box_locker', 'Permission to read box locker information'),
(87, 'update_box_locker', 'Permission to update box locker information'),
(88, 'delete_box_locker', 'Permission to delete a box locker'),
-- Box Image
(89, 'create_box_image', 'Permission to create a new box image'),
(90, 'read_box_image', 'Permission to read box image information'),
(91, 'update_box_image', 'Permission to update box image information'),
(92, 'delete_box_image', 'Permission to delete a box image'),
-- Box Model
(93, 'create_box_model', 'Permission to create a new box model'),
(94, 'read_box_model', 'Permission to read box model information'),
(95, 'update_box_model', 'Permission to update box model information'),
(96, 'delete_box_model', 'Permission to delete a box model');

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
    user_name TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    fcm_token VARCHAR(255) UNIQUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    prefered_language VARCHAR(20),    
    FOREIGN KEY (role_id) REFERENCES role(id)
);

INSERT INTO users (id, role_id, fcm_token, createdAt, updatedAt, is_active, phone_number, email, password, prefered_language) VALUES
('Ahln_24_U0000001', 1, 'token1', NOW(), NOW(), TRUE, '1234567890', 'admin@example.com', 'hashed_password1', 'en'),


-- Create the User_Permission table
CREATE TABLE IF NOT EXISTS user_permission (
    user_id VARCHAR(20) NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permission(id) ON DELETE CASCADE
);
