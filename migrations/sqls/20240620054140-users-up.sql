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
('create_box_generation', 'Permission to create a new box generation'),
('read_box_generation', 'Permission to read box generation information'),
('update_box_generation', 'Permission to update box generation information'),
('delete_box_generation', 'Permission to delete a box generation');

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
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) ,
    preferred_language VARCHAR(20),    
    FOREIGN KEY (role_id) REFERENCES role(id),
    register_otp VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    token TEXT 
);

INSERT INTO users (id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, password, preferred_language) VALUES
('Ahln_24_U0000001', 'Admin', 1, NOW(), NOW(), TRUE, '527048530', 'abdelrahmanaosman99@gmail.com', 'admin654', 'en');

-- Create the User_Permission table
CREATE TABLE IF NOT EXISTS user_permission (
    user_id VARCHAR(20) NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permission(id) ON DELETE CASCADE
);


-- Grant all permissions to the system_admin user
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM role r, permission p
WHERE r.title = 'system_admin';


-- Customer role permissions
INSERT INTO role_permission (role_id, permission_id)
VALUES
  (2, 2),     -- read_user
  (2, 42),    -- read_notification
  (2, 46),    -- read_mqtt_topic
  (2, 50),    -- read_mqtt_log
  (2, 54),    -- read_service
  (2, 58),    -- read_card
  (2, 70),    -- read_address
  (2, 74),    -- read_otp
  (2, 86),    -- read_box_locker
  (2, 90);    -- read_box_image

-- Relative Customer role permissions
INSERT INTO role_permission (role_id, permission_id)
VALUES
  (3, 2),     -- read_user
  (3, 42),    -- read_notification
  (3, 46),    -- read_mqtt_topic
  (3, 50),    -- read_mqtt_log
  (3, 54),    -- read_service
  (3, 58),    -- read_card
  (3, 70),    -- read_address
  (3, 74),    -- read_otp
  (3, 86),    -- read_box_locker
  (3, 90);    -- read_box_image

-- Operation Manager role permissions
INSERT INTO role_permission (role_id, permission_id)
VALUES
  (4, 1),     -- create_user
  (4, 2),     -- read_user
  (4, 6),     -- read_role
  (4, 10),    -- read_permission
  (4, 14),    -- read_user_permission
  (4, 18),    -- read_role_permission
  (4, 21),    -- create_tablet
  (4, 22),    -- read_tablet
  (4, 23),    -- update_tablet
  (4, 24),    -- delete_tablet
  (4, 30),    -- create_ticket_room
  (4, 31),    -- read_ticket_room
  (4, 32),    -- update_ticket_room
  (4, 33),    -- delete_ticket_room
  (4, 34),    -- read_message
  (4, 35),    -- update_message
  (4, 36),    -- delete_message
  (4, 37),    -- create_audit_trail
  (4, 38),    -- read_audit_trail
  (4, 41),    -- create_notification
  (4, 42),    -- read_notification
  (4, 45),    -- create_mqtt_topic
  (4, 46),    -- read_mqtt_topic
  (4, 49),    -- create_mqtt_log
  (4, 50),    -- read_mqtt_log
  (4, 53),    -- create_service
  (4, 54),    -- read_service
  (4, 55),    -- update_service
  (4, 56),    -- delete_service
  (4, 57),    -- create_card
  (4, 58),    -- read_card // need a questions
  (4, 59),    -- update_card // 
  (4, 60),    -- delete_card // 
  (4, 61),    -- create_payment //
  (4, 62),    -- read_payment //
  (4, 63),    -- update_payment // 
  (4, 64),    -- delete_payment // 
  (4, 65),    -- create_user_box
  (4, 66),    -- read_user_box
  (4, 67),    -- update_user_box
  (4, 68),    -- delete_user_box
  (4, 69),    -- create_address
  (4, 70),    -- read_address
  (4, 71),    -- update_address
  (4, 72),    -- delete_address
  (4, 73),    -- create_otp //
  (4, 74),    -- read_otp //
  (4, 75),    -- update_otp //
  (4, 76),    -- delete_otp //
  (4, 77),    -- create_delivery_package
  (4, 78),    -- read_delivery_package
  (4, 79),    -- update_delivery_package
  (4, 80),    -- delete_delivery_package
  (4, 81),    -- create_shipping_company
  (4, 82),    -- read_shipping_company
  (4, 83),    -- update_shipping_company
  (4, 84),    -- delete_shipping_company
  (4, 85),    -- create_box_locker
  (4, 86),    -- read_box_locker
  (4, 87),    -- update_box_locker
  (4, 88),    -- delete_box_locker
  (4, 89),    -- create_box_image
  (4, 90);    -- read_box_image

-- Operation Member role permissions
INSERT INTO role_permission (role_id, permission_id)
VALUES
  (5, 2),     -- read_user
  (5, 30),    -- create_ticket_room
  (5, 31),    -- read_ticket_room
  (5, 34),    -- read_message
  (5, 54),    -- read_service
  (5, 58),    -- read_card
  (5, 62),    -- read_payment
  (5, 70),    -- read_address
  (5, 74),    -- read_otp
  (5, 78),    -- read_delivery_package
  (5, 86),    -- read_box_locker
  (5, 90);    -- read_box_image

-- Sales Manager role permissions
INSERT INTO role_permission (role_id, permission_id)
VALUES
  (6, 2),     -- read_user
  (6, 26),    -- read_box
  (6, 30),    -- create_ticket_room
  (6, 31),    -- read_ticket_room
  (6, 34),    -- read_message
  (6, 38),    -- read_audit_trail
  (6, 42),    -- read_notification
  (6, 46),    -- read_mqtt_topic
  (6, 50),    -- read_mqtt_log
  (6, 54),    -- read_service
  (6, 58),    -- read_card
  (6, 62),    -- read_payment
  (6, 70),    -- read_address
  (6, 74),    -- read_otp
  (6, 78),    -- read_delivery_package
  (6, 86),    -- read_box_locker
  (6, 90);    -- read_box_image

-- Sales Member role permissions
INSERT INTO role_permission (role_id, permission_id)
VALUES
  (7, 2),     -- read_user
  (7, 26),    -- read_box
  (7, 30),    -- create_ticket_room
  (7, 31),    -- read_ticket_room
  (7, 34),    -- read_message
  (7, 54),    -- read_service
  (7, 58),    -- read_card
  (7, 62),    -- read_payment
  (7, 70),    -- read_address
  (7, 74),    -- read_otp
  (7, 78),    -- read_delivery_package
  (7, 86),    -- read_box_locker
  (7, 90);    -- read_box_image

-- Technical Manager role permissions (continued)
INSERT INTO role_permission (role_id, permission_id)
VALUES
  (8, 2),     -- read_user
  (8, 22),    -- read_tablet
  (8, 26),    -- read_box
  (8, 30),    -- create_ticket_room
  (8, 31),    -- read_ticket_room
  (8, 34),    -- read_message
  (8, 38),    -- read_audit_trail
  (8, 42),    -- read_notification
  (8, 46),    -- read_mqtt_topic
  (8, 50),    -- read_mqtt_log
  (8, 54),    -- read_service
  (8, 58),    -- read_card
  (8, 62),    -- read_payment
  (8, 70),    -- read_address
  (8, 74),    -- read_otp
  (8, 78),    -- read_delivery_package
  (8, 82),    -- read_shipping_company
  (8, 86),    -- read_box_locker
  (8, 90);    -- read_box_image

-- Technical Member role permissions
INSERT INTO role_permission (role_id, permission_id)
VALUES
  (9, 2),     -- read_user
  (9, 26),    -- read_box
  (9, 30),    -- create_ticket_room
  (9, 31),    -- read_ticket_room
  (9, 34),    -- read_message
  (9, 54),    -- read_service
  (9, 58),    -- read_card
  (9, 62),    -- read_payment
  (9, 70),    -- read_address
  (9, 74),    -- read_otp
  (9, 78),    -- read_delivery_package
  (9, 82),    -- read_shipping_company
  (9, 86),    -- read_box_locker
  (9, 90);    -- read_box_image

-- Guest role permissions
INSERT INTO role_permission (role_id, permission_id)
VALUES
  (10,1);      -- create_user


-- Box role permissions
INSERT INTO role_permission (role_id, permission_id)
VALUES
  (11, 2),    -- read_user
  (11, 26),   -- read_box
  (11, 30),   -- create_ticket_room
  (11, 31),   -- read_ticket_room
  (11, 34),   -- read_message
  (11, 42),   -- read_notification
  (11, 46),   -- read_mqtt_topic
  (11, 50),   -- read_mqtt_log
  (11, 54),   -- read_service
  (11, 58),   -- read_card
  (11, 62),   -- read_payment
  (11, 70),   -- read_address
  (11, 74),   -- read_otp
  (11, 78),   -- read_delivery_package
  (11, 82),   -- read_shipping_company
  (11, 86),   -- read_box_locker
  (11, 90);   -- read_box_image