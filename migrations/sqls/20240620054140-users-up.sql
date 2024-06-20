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
    fcm_token VARCHAR(255) UNIQUE NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    prefered_language VARCHAR(20),    
    FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Create the User_Permission table
CREATE TABLE IF NOT EXISTS user_permission (
    user_id VARCHAR(20) NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permission(id) ON DELETE CASCADE
);
