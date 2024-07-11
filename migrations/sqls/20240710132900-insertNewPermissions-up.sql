/* Replace with your SQL commands */

-- Insert new permissions for additional models
INSERT INTO permission (title, description) VALUES
-- Box Screen Message
('create_box_screen_message', 'Permission to create a new box screen message'), --97
('read_box_screen_message', 'Permission to read box screen message information'), --98
('update_box_screen_message', 'Permission to update box screen message information'), --99
('delete_box_screen_message', 'Permission to delete a box screen message'), -- 100
-- Contact Us
('create_contact_us', 'Permission to create a new contact us message'), --101
('read_contact_us', 'Permission to read contact us message information'), --102
('update_contact_us', 'Permission to update contact us message information'),--103
('delete_contact_us', 'Permission to delete a contact us message'),--104
-- DP Fav List
('create_dp_fav_list', 'Permission to create a new dp fav list'),--105
('read_dp_fav_list', 'Permission to read dp fav list information'),--106
('update_dp_fav_list', 'Permission to update dp fav list information'),--107
('delete_dp_fav_list', 'Permission to delete a dp fav list'),--108
-- Sales Invoice
('create_sales_invoice', 'Permission to create a new sales invoice'),--109
('read_sales_invoice', 'Permission to read sales invoice information'),--110
('update_sales_invoice', 'Permission to update sales invoice information'),--111
('delete_sales_invoice', 'Permission to delete a sales invoice');--112


