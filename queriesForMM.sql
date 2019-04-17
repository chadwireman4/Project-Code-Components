



-- Delete user
DELETE FROM ONLY users WHERE user_name = 'CHANGEME' AND user_password = 'CHANGEME'
AND user_email = 'CHANGEME';

-- Add User ->>>> NOTE CHECK THAT THE USER DOESNT EXIST FIRST!!
INSERT INTO users( 
	user_name ,
	user_password ,
	user_email ,
	user_password) 
VALUES (
	'CHANGEME' ,
	'CHANGEME' ,
	'CHANGEME' ,
	'CHANGEME' );

-- Check if user exists -- returns true or false
SELECT EXISTS(SELECT 1 FROM users WHERE user_name = 'CHANGE ME' OR user_email = 'CHANGEME');

-- Add event for user
INSERT INTO appointments (
	user_id , 
	event_name , 
    event_length , 
    event_start_time , 
    event_end_time , 
    event_urgency ,
    event_color )
	VALUES ( 
		(SELECT id FROM users WHERE id = 'CHANGEME'),
		'CHANGEME' ,
		'CHANGEME' , 
		'CHANGEME' ,
		'CHANGEME' ,
		'CHANGEME' ,
		'CHANGEME' );

-- Delete Event for user
DELETE FROM ONLY appointments WHERE user_id = 'CHANGEME' AND event_name = 'CHANGEME';

-- EDITING VALUES ----------------------------------------------------------------------------

-- Edit event name
UPDATE only appointments 
	SET event_name = 'CHANGEME'
	WHERE user_id = 'CHANGEME' 
	AND event_name = 'CHANGEME';

--Edit event start time
UPDATE only appointments 
	SET event_start_time = 'CHANGEME'
	WHERE user_id = 'CHANGEME'
	AND event_name = 'CHANGEME';

--Edit event end time
UPDATE only appointments 
	SET event_end_time = 'CHANGEME'
	WHERE user_id = 'CHANGEME'
	AND event_name = 'CHANGEME';

--Edit event length
UPDATE only appointments 
	SET event_length = 'CHANGEME'
	WHERE user_id = 'CHANGEME'
	AND event_name = 'CHANGEME';

--Change event urgency
UPDATE only appointments 
	SET event_urgency = 'CHANGEME'
	WHERE user_id = 'CHANGEME' 
	AND event_name = 'CHANGEME';

-- Change event Color
UPDATE only appointments 
	SET event_color = 'CHANGEME'
	WHERE user_id = 'CHANGEME' 
	AND event_name = 'CHANGEME';

-- Change user password
UPDATE only users
	SET user_password = 'CHANGEME'
	WHERE user_name = 'CHANGEME'
	AND user_id = 'CHANGEME';

-- Change user email
UPDATE only users
	SET user_email = 'CHANGEME'
	WHERE user_name = 'CHANGEME'
	AND user_id = 'CHANGEME';

-- Change user phone number
UPDATE only users
	SET user_phone_number = 'CHANGEME'
	WHERE user_name = 'CHANGEME'
	AND user_id = 'CHANGEME';

--Change user name
UPDATE only users
	SET user_name = 'CHANGEME'
	WHERE user_id = 'CHANGEME'
	AND user_password = 'CHANGEME';

 -- END EDITING VALUES -----------------------------------------------------------------------
