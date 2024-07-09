/* Replace with your SQL commands */

ALTER TABLE Relative_Customer DROP COLUMN box_id ;
ALTER TABLE User_Box ADD COLUMN relative_cutomer_id INTEGER REFERENCES Relative_Customer(id);