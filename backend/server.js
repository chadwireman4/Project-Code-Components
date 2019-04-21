/***********************
  Load Components!

    Express      - A Node.js Framework
    Body-Parser  - A tool to help use parse the data in a post request
	Pg-Promise   - A database tool to help use connect to our PostgreSQL database
	Request      - Used to access the 3rd part APIs
	node-mailjet - Used for the emails
    
    THIS IS OUR REST API, Using JSON FOR DATA FORMAT

***********************/

const username = '';
const password = '';
const darkSkyAPI = '30968187ff395abadb3d0b894cb5307e';

const express = require('express'); //Ensure our express framework has been added
const path = require("path");
const request = require('request');
const mailjet = require('node-mailjet').connect(username, password);
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));

//Create Database Connection
var pgp = require('pg-promise')();
//define the port, create-react-app
const port = 3001; //react-app will use 3000

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'micro_manage_db', //DB name here
	user: 'brookestevens',
	password: 'postgres'
};

//make a connection to the database
var db = pgp(dbConfig);

//testing

app.get('/test', (req, res) => { 
	res.send({"express": "hello from express"});

app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path)
  }
})

});

//convert this to something that the calendar can read
function convertEvents(a){
	var eventList = [];
	a.forEach( i => {
		eventList.push({
			'title' : i.eventname,
			'start' : new Date(i.startdate),
			'end' : new Date(i.enddate),
			id : i.id
		})
	})
	//console.table(eventList);
	return eventList;
}

//SERVE UP THE Login and Registration Pages!!
request(`https://api.darksky.net/forecast/${darkSkyAPI}/40.0150,105.2705`, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var b = JSON.parse(body);
		app.get('/api/darksky', (req, res) => {
			res.send(b.currently)
		})
    }
    res.send({error: 'error occured'});
});

//for the email API --> using mailjet package 
// send back the status message if it was a success

app.post('/api/email', (req, res) => {
	var email = req.body.email;
	var name = req.body.name;
	const mailrequest = mailjet
		.post("send", { 'version': 'v3.1' })
		.request({
			"Messages": [
				{
					"From": {
						"Email": 'brst4163@colorado.edu',
						"Name": "MicroManage"
					},
					"To": [
						{
							"Email": email,
							"Name": "You, a productive Individual"
						}
					],
					"Subject": `Time to get working on ${name}`,
					"TextPart": "A Reminder from MicroManage!",
					"HTMLPart": "<h3> Time to get your shit together </h3>"
				}
			]
		});
	//Do something with the promise
	mailrequest
		.then((result) => {
			console.log(result.body);
			res.send({ message : result.body.Messages[0].Status }); //send back a success message
		})
		.catch((err) => {
			console.log(err.statusCode)
		})
});

//serve up the pages

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/user-log-in.html'));
});

app.get('/registration', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/registration.html'));
});


//redirect to the registration page
//start on the login page
app.post('/', (req, res) => {
	var user = req.body.Username;
	var pass = req.body.Password;
	console.log(`user: ${user} and pass: ${pass}`);
	if (user === '' && pass === '') {
		res.send({ message: "error" });
	}
	//check if the user is verified first
	else if (user === '' || pass === '') {
		res.send({ message: "error" });
	}
	else {
		res.send({ message: "success" });
	}
});

//icons for page
app.get('/micromanage.svg', (req, res) => { res.sendFile(path.join(__dirname, '/public/micromanage.svg')) });
//Registration page
app.post('/registration', (req, res) => {
	var name = req.body.Username;
	var email = req.body.Email;
	var password = req.body.Password;
	//if all credentials work out then let them through
	if (name !== '' && email !== '' && password !== '') {
		res.redirect('http://localhost:3000');
	}
	else {
		console.log("error");
		res.redirect('/registration');
	}
});

//display the events
app.get('/api/display-events-for-user', (req,res) => {

	var user_id = req.query.user_id;
	user_id = '1';

	var query = `SELECT * FROM appointments WHERE user_id = '${user_id}'`;

  db.task('get-everything', task => {
    return task.batch([
				task.any(query)
    ]);
	})
	.then(data =>{
    //success
    	res.send({
    			data: data[0]
    	});
    	console.log("Sent events, succcess");

	})
	.catch(error =>{
		//error
		console.log(error);
	});
});

app.get('/api/check-user',(req,res) => {
    //Checks if user-name OR email is in db
    //Returns true or false.
    console.log("Checking User.");

    var name = req.query.user_name;
    var email = req.query.user_email;

    console.log("Name: " + name);
    console.log("email:" + email );

    var query_statement = `SELECT EXISTS(SELECT 1 FROM users WHERE user_name = '${ name }' OR user_email = '${{ email }}');`;


    db.one(query_statement)
    .then( data => {
        console.log("Database queried successfully...");
        res.send({
            data:data, 
        });
        res.end();
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});

app.get('api/add-user',(req,res) => {
    //Adds User to user table
    console.log("Adding User.");
    var name = req.body.user_name;
    var password = req.body.user_password;
    var email = req.body.user_email;

    var query_statement = `INSERT INTO users(user_name , user_password,
    user_email) VALUES('${name}', '${password}', '${email}');`;


    db.none(query_statement)
    .then( () => {
        console.log("Success.");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});

app.get('api/add-appointment',(req,res) =>{
    //Requires user_id from front end
    //Adds appointment to appointments table
    console.log("Adding Event.");
    var user_id = req.body.user_id;
    var name = req.body.event_name;
    var length = req.body.event_length;
    var start = req.body.event_start_time;
    var end = req.body.event_end_time;
    var urg = req.body.event_urgency;
    var color = req.body.event_color;


    var query_statement = `INSERT INTO appointments (
    user_id , 
    event_name , 
    event_length , 
    event_start_time , 
    event_end_time , 
    event_urgency ,
    event_color )
    VALUES ( 
        (SELECT id FROM users WHERE id = '${{user_id}}'),
        '${{ name }}' ,
        '${{ length }}' , 
        '${{ start }}' ,
        '${{ end }}' ,
        '${{ urg }}' ,
        '${{ color }}' );`;


        db.none(query_statement)
        .then( () => {
            console.log("Success");
        })
        .catch( err => {
            console.log("Error: " + err );
        });
});

app.get('api/delete-user', (req,res) => {
    console.log("Deleting user.");


    var name_of_user = req.body.name_of_user;
    var password = req.body.password;
    var email = req.body.email;

    var query_statement = `DELETE FROM ONLY users 
    WHERE user_name = ${name_of_user} AND user_password = ${password} 
    AND user_email = ${email}`;
    db.none(query_statement)
    .then(() => {
        console.log("Success, user deleted.");
        res.end();
    })
    .catch(error => {
        console.log("Error: " + error);
        res.end();
    });
});

app.get('api/delete-event', (req,res) =>{
    console.log("Deleting event.");

    var event_name = req.body.event_name;
    var user_id = req.body.user_id;

    var query_statement = `DELETE FROM ONLY 
    appointments WHERE user_id = '${user_id}' AND event_name = '${event_name}';`;

    db.none(query_statement)
    .then( () => {
        console.log("Database queried successfully...");
    })
    .catch( err => {
        coneole.log("Error: " + err);
    });

});

app.get('api/add-appointment',(req,res) =>{
    //Requires user_id from front end
    //Adds appointment to appointments table
    console.log("Adding Event.");
    var user_id = req.body.user_id;
    var name = req.body.event_name;
    var length = req.body.event_length;
    var start = req.body.event_start_time;
    var end = req.body.event_end_time;
    var urg = req.body.event_urgency;
    var color = req.body.event_color;


    var query_statement = `INSERT INTO appointments (
    user_id , 
    event_name , 
    event_length , 
    event_start_time , 
    event_end_time , 
    event_urgency ,
    event_color )
    VALUES ( 
        (SELECT id FROM users WHERE id = '${{user_id}}'),
        '${{ name }}' ,
        '${{ length }}' , 
        '${{ start }}' ,
        '${{ end }}' ,
        '${{ urg }}' ,
        '${{ color }}' );`;


        db.none(query_statement)
        .then( () => {
            console.log("Success");
        })
        .catch( err => {
            console.log("Error: " + err );
        });
});

app.get('api/delete-event',(req,res) =>{
    //Requires user_id from front end
    //Deletes appointment
    console.log("Deleting Event.");

    var user_id = req.body.user_id;
    var name = req.body.event_name;


    var query_statement = `DELETE FROM ONLY 
    appointments WHERE user_id = '${user_id}' AND event_name = '${name}';`;


        db.none(query_statement)
        .then( () => {
            console.log("Success");
        })
        .catch( err => {
            console.log("Error: " + err );
        });
});

app.get('api/edit-event-name',(req,res) =>{
    //Requires user_id from front end
   	var user_id = req.body.user_id;
    var name = req.body.event_name;
    var newName = req.body.new_event_name;
    var query_statement = `UPDATE only appointments 
	SET event_name = '${newName}'
	WHERE user_id = '${user_id}' 
	AND event_name = '${name}';`;
    db.none(query_statement)
    .then( () => {
        console.log("Success");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});

app.get('api/edit-event-start-time',(req,res) =>{
    //Requires user_id from front end
   	var user_id = req.body.user_id;
    var name = req.body.event_name;
    var new_start_time = req.body.new_start_time;

    var query_statement = `UPDATE only appointments 
	SET event_start_time = '${new_start_time}'
	WHERE user_id = '${user_id}' 
	AND event_name = '${name}';`;

    db.none(query_statement)
    .then( () => {
        console.log("Success");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});

app.get('api/edit-event-end-time',(req,res) =>{
    //Requires user_id from front end
   	var user_id = req.body.user_id;
    var name = req.body.event_name;
    var new_end_time = req.body.new_end_time;

    var query_statement = `UPDATE only appointments 
	SET event_end_time = '${new_end_time}'
	WHERE user_id = '${user_id}' 
	AND event_name = '${name}';`;

    db.none(query_statement)
    .then( () => {
        console.log("Success");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});

app.get('api/edit-event-color',(req,res) =>{
    //Requires user_id from front end
   	var user_id = req.body.user_id;
    var name = req.body.event_name;
    var new_color = req.body.new_color;
            
    var query_statement = `UPDATE only appointments 
	SET event_color = '${new_color}'
	WHERE user_id = '${user_id}' 
	AND event_name = '${name}';`;

    db.none(query_statement)
    .then( () => {
        console.log("Success");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});

app.get('api/edit-user-password',(req,res) =>{
    //Requires user_id from front end
   	var user_id = req.body.user_id;
    var name = req.body.user_name;
    var new_user_password = req.body.new_user_password;
            
    var query_statement = `UPDATE only users
	SET user_password = '${{new_user_password}}'
	WHERE user_name = '${{user_name}}'
	AND user_id = '${{user_id}}';`;

    db.none(query_statement)
    .then( () => {
        console.log("Success");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});


app.get('api/edit-user-email',(req,res) =>{
    //Requires user_id from front end
   	var user_id = req.body.user_id;
    var name = req.body.user_name;
    var new_user_email = req.body.new_user_email;
            
    var query_statement = `UPDATE only users
	SET user_email = '${{new_user_email}}'
	WHERE user_name = '${{user_name}}'
	AND user_id = '${{user_id}}';`;

    db.none(query_statement)
    .then( () => {
        console.log("Success");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});

app.get('api/edit-user-name',(req,res) =>{
    //Requires user_id from front end
   	var user_id = req.body.user_id;
    var password = req.body.user_password;
    var new_user_name = req.body.new_user_name;
            
    var query_statement = `UPDATE only users
	SET user_name = '${{new_user_name}}'
	WHERE user_password = '${{password}}'
	AND user_id = '${{user_id}}';`;

    db.none(query_statement)
    .then( () => {
        console.log("Success");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});

app.listen(port, () => console.log(`App is listening on port ${port}!`));