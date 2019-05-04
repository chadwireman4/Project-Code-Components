
\c micro_manage_db;

INSERT INTO users( user_name , user_password , user_email )
	VALUES ('John Doe' , '123' , 'CHANGEME');


INSERT INTO appointments ( user_id , event_name , event_length , 
	event_start_time , event_end_time, event_urgency, event_color)
VALUES ( (SELECT id FROM users WHERE user_email = 'John CHANGEME') , 'Binge watch TV', 
		'1 hour', '2019-04-24 17:00:00', '2019-04-24 18:00:00' , 10 , '#FF0000'),
			( (SELECT id FROM users WHERE user_email = 'CHANGEME') , 'Big Project Due!', 
		'0', '2019-04-24 12:00:00', '2019-04-24 13:00:00' , 10 , '#FF0000'),
			( (SELECT id FROM users WHERE user_email = 'CHANGEME') , 'Dinner With Mayor', 
		'1 hour', '2019-04-24 20:00:00', '2019-04-24 22:00:00' , 10 , '#FF1000'),
			( (SELECT id FROM users WHERE user_email = 'CHANGEME') , 'Family Time', 
		'2 hours', '2019-04-24 06:00:00', '2019-04-24 07:00:00' , 10 , '#000000'),

			( (SELECT id FROM users WHERE user_email = 'CHANGEME') , 'Pool Party', 
		'2 hours', '2019-04-20 12:00:00', '2019-04-20 14:00:00' , 10 , '#000000'),

			( (SELECT id FROM users WHERE user_email = 'CHANGEME') , 'Visit Grandma', 
		'2 hours', '2019-04-27 06:00:00', '2019-04-27 07:00:00' , 10 , '#000000'),

			( (SELECT id FROM users WHERE user_email = 'CHANGEME') , 'Finish Project', 
		'2 hours', '2019-04-29 06:00:00', '2019-04-29 07:00:00' , 10 , '#000000'),
			( (SELECT id FROM users WHERE user_email = 'CHANGEME') , 'Grandma Coming', 
		'2 hours', '2019-04-09 06:00:00', '2019-04-10 07:00:00' , 10 , '#000000'),
			( (SELECT id FROM users WHERE user_email = 'CHANGEME') , 'Prepare for Zombie', 
		'2 hours', '2019-04-05 06:00:00', '2019-04-06 07:00:00' , 10 , '#000000');
