/* Replace with your SQL commands */

ALTER TABLE System_Log 
ADD COLUMN source VARCHAR(50);

INSERT INTO users (id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, password, preferred_language) VALUES
('Ahln_24_U00000010', 'Guest', 10, NOW(), NOW(), TRUE, '527048530', 'mr.abdo1920@gmail.com', 'guest123', 'en');
