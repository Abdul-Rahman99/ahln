/* Replace with your SQL commands */
ALTER TABLE User_Box DROP COLUMN relative_cutomer_id ;
ALTER TABLE User_Box ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
