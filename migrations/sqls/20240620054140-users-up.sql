-- Create the Role table
CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description TEXT
);

INSERT INTO role (title, description) VALUES
('system_admin', 'System Administrator role with full access to the system.'),
('customer', 'Customer role with access to customer-related features.'),
('relative_customer', 'Relative of a customer with limited access.'),
('operation_manager', 'Operations Manager role responsible for overseeing operations.'),
('operation_member', 'Operations team member with access to operational tasks.'),
('sales_manager', 'Sales Manager role overseeing the sales team.'),
('sales_member', 'Sales team member involved in sales activities.'),
('technical_manager', 'Technical Manager role overseeing technical operations.'),
('technical_member', 'Technical team member involved in technical tasks.'),
('guest' , 'Guest User to access a few routes in the project'),
('box' , 'Box User to access a defined routes in the project');

-- Create the Permission table
CREATE TABLE IF NOT EXISTS permission (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL, 
    description TEXT
);

-- Insert data into Permission table for the specified entities
INSERT INTO permission (title, description) VALUES
-- Users
('create_user', 'Permission to create a new user'),
('read_user', 'Permission to read user information'),
('update_user', 'Permission to update user information'),
('delete_user', 'Permission to delete a user'),
-- Role
('create_role', 'Permission to create a new role'),
('read_role', 'Permission to read role information'),
('update_role', 'Permission to update role information'),
('delete_role', 'Permission to delete a role'),
-- Permission
('create_permission', 'Permission to create a new permission'),
('read_permission', 'Permission to read permission information'),
('update_permission', 'Permission to update permission information'),
('delete_permission', 'Permission to delete a permission'),
-- User Permission
('create_user_permission', 'Permission to create a new user permission'),
('read_user_permission', 'Permission to read user permission information'),
('update_user_permission', 'Permission to update user permission information'),
('delete_user_permission', 'Permission to delete a user permission'),
-- Role Permission
('create_role_permission', 'Permission to create a new role permission'),
('read_role_permission', 'Permission to read role permission information'),
('update_role_permission', 'Permission to update role permission information'),
('delete_role_permission', 'Permission to delete a role permission'),
-- Tablet
('create_tablet', 'Permission to create a new tablet'),
('read_tablet', 'Permission to read tablet information'),
('update_tablet', 'Permission to update tablet information'),
('delete_tablet', 'Permission to delete a tablet'),
-- Box
('create_box', 'Permission to create a new box'),
('read_box', 'Permission to read box information'),
('update_box', 'Permission to update box information'),
('delete_box', 'Permission to delete a box'),
-- Ticket Room
('create_ticket_room', 'Permission to create a new ticket room'),
('read_ticket_room', 'Permission to read ticket room information'),
('update_ticket_room', 'Permission to update ticket room information'),
('delete_ticket_room', 'Permission to delete a ticket room'),
-- Message
('create_message', 'Permission to create a new message'),
('read_message', 'Permission to read message information'),
('update_message', 'Permission to update message information'),
('delete_message', 'Permission to delete a message'),
-- Audit Trail
('create_audit_trail', 'Permission to create a new audit trail'),
('read_audit_trail', 'Permission to read audit trail information'),
('update_audit_trail', 'Permission to update audit trail information'),
('delete_audit_trail', 'Permission to delete an audit trail'),
-- Notification
('create_notification', 'Permission to create a new notification'),
('read_notification', 'Permission to read notification information'),
('update_notification', 'Permission to update notification information'),
('delete_notification', 'Permission to delete a notification'),
-- MQTT Topic
('create_mqtt_topic', 'Permission to create a new MQTT topic'),
('read_mqtt_topic', 'Permission to read MQTT topic information'),
('update_mqtt_topic', 'Permission to update MQTT topic information'),
('delete_mqtt_topic', 'Permission to delete an MQTT topic'),
-- MQTT Log
('create_mqtt_log', 'Permission to create a new MQTT log'),
('read_mqtt_log', 'Permission to read MQTT log information'),
('update_mqtt_log', 'Permission to update MQTT log information'),
('delete_mqtt_log', 'Permission to delete an MQTT log'),
-- Service
('create_service', 'Permission to create a new service'),
('read_service', 'Permission to read service information'),
('update_service', 'Permission to update service information'),
('delete_service', 'Permission to delete a service'),
-- Card
('create_card', 'Permission to create a new card'),
('read_card', 'Permission to read card information'),
('update_card', 'Permission to update card information'),
('delete_card', 'Permission to delete a card'),
-- Payment
('create_payment', 'Permission to create a new payment'),
('read_payment', 'Permission to read payment information'),
('update_payment', 'Permission to update payment information'),
('delete_payment', 'Permission to delete a payment'),
-- User Box
('create_user_box', 'Permission to create a new user box'),
('read_user_box', 'Permission to read user box information'),
('update_user_box', 'Permission to update user box information'),
('delete_user_box', 'Permission to delete a user box'),
-- Address
('create_address', 'Permission to create a new address'),
('read_address', 'Permission to read address information'),
('update_address', 'Permission to update address information'),
('delete_address', 'Permission to delete an address'),
-- OTP
('create_otp', 'Permission to create a new OTP'),
('read_otp', 'Permission to read OTP information'),
('update_otp', 'Permission to update OTP information'),
('delete_otp', 'Permission to delete an OTP'),
-- Delivery Package
('create_delivery_package', 'Permission to create a new delivery package'),
('read_delivery_package', 'Permission to read delivery package information'),
('update_delivery_package', 'Permission to update delivery package information'),
('delete_delivery_package', 'Permission to delete a delivery package'),
-- Shipping Company
('create_shipping_company', 'Permission to create a new shipping company'),
('read_shipping_company', 'Permission to read shipping company information'),
('update_shipping_company', 'Permission to update shipping company information'),
('delete_shipping_company', 'Permission to delete a shipping company'),
-- Box Locker
('create_box_locker', 'Permission to create a new box locker'),
('read_box_locker', 'Permission to read box locker information'),
('update_box_locker', 'Permission to update box locker information'),
('delete_box_locker', 'Permission to delete a box locker'),
-- Box Image
('create_box_image', 'Permission to create a new box image'),
('read_box_image', 'Permission to read box image information'),
('update_box_image', 'Permission to update box image information'),
('delete_box_image', 'Permission to delete a box image'),
-- Box Model
('create_box_model', 'Permission to create a new box model'),
('read_box_model', 'Permission to read box model information'),
('update_box_model', 'Permission to update box model information'),
('delete_box_model', 'Permission to delete a box model');

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
    role_id INTEGER,
    fcm_token VARCHAR(255) UNIQUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) ,
    preferred_language VARCHAR(20),    
    FOREIGN KEY (role_id) REFERENCES role(id)
);

INSERT INTO users (id, user_name, role_id, fcm_token, createdAt, updatedAt, is_active, phone_number, email, password, preferred_language) VALUES
('Ahln_24_U0000001', 'Admin', 1, 'token1', NOW(), NOW(), TRUE, '527048530', 'admin@dcc.ai', 'admin654', 'en');

-- Create the User_Permission table
CREATE TABLE IF NOT EXISTS user_permission (
    user_id VARCHAR(20) NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permission(id) ON DELETE CASCADE
);


-- Grant all permissions to the system_admin user
INSERT INTO user_permission (user_id, permission_id)
SELECT 'Ahln_24_U0000001', id FROM permission;