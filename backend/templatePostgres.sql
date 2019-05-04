

DROP DATABASE IF EXISTS micro_manage_db;
CREATE DATABASE micro_manage_db;

\c micro_manage_db;


CREATE TABLE users ( 
	user_name VARCHAR(40) NOT NULL,
	user_password VARCHAR(64) NOT NULL,
	user_phone_number INTEGER, 
	user_email VARCHAR(50) NOT NULL,
	id SERIAL PRIMARY KEY
	);

CREATE TABLE appointments  (
	user_id INTEGER,
	event_id SERIAL,
	event_name VARCHAR(20),
	event_length VARCHAR(20),
	event_start_time TIMESTAMP WITHOUT TIME ZONE,
	event_end_time TIMESTAMP WITHOUT TIME ZONE,
	event_urgency INTEGER,
	event_color VARCHAR(10),
	PRIMARY KEY( event_id ),
	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE user_group (
	group_name VARCHAR(30),
	group_password 	VARCHAR(40),
	group_id SERIAL PRIMARY KEY,
	user_id_e INTEGER[]
);

INSERT INTO users( user_name , user_password , user_email )
	VALUES ('Test User 1' , '123' , 'abc@gmail.com'),
			('Test User 2' , '321' , 'abc@yahoo.com'),
			('Test User 3', '12345' , 'abc@aol.com'),
			('Test User 4', '54321' , 'abc@aim.com');

INSERT INTO appointments ( user_id , event_name , event_length , 
	event_start_time , event_end_time, event_urgency, event_color)
	VALUES ( (SELECT id FROM users WHERE user_name = 'Test User 1') , 'Work Meeting', 
		'1 hour', '2019-04-07 12:00:00 	 	', '2019-04-07 13:00:00' , 10 , '#FF0000'),	
			( (SELECT id FROM users WHERE user_name = 'Test User 1') , 'Big Project Due!', 
		'0', '2019-04-07 12:00:00', '2019-04-07 12:00:00' , 10 , '#FF0000'),
			( (SELECT id FROM users WHERE user_name = 'Test User 2') , 'Dinner With Mayor', 
		'1 hour', '2019-04-08 20:00:00', '2019-04-08 22:00:00' , 10 , '#FF1000'),
			( (SELECT id FROM users WHERE user_name = 'Test User 3') , 'Family Time', 
		'2 hours', '2019-04-10 10:00:00', '2019-04-10 13:00:00' , 10 , '#000000');

SELECT * FROM users;
SELECT * FROM appointments;

ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (user_email);

