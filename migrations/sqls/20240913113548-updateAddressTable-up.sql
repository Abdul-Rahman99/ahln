/* Replace with your SQL commands */

ALTER TABLE address DROP COLUMN country;
ALTER TABLE address DROP COLUMN city;

ALTER TABLE address 
ADD COLUMN country_id INTEGER REFERENCES Country(id);

ALTER TABLE address 
ADD COLUMN city_id INTEGER REFERENCES City(id);

