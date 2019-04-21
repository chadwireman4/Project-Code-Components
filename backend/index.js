/***********************
  Load Components!

    Express      - A Node.js Framework
    Body-Parser  - A tool to help use parse the data in a post request
	Pg-Promise   - A database tool to help use connect to our PostgreSQL database
	Request      - Used to access the 3rd part APIs
	node-mailjet - Used for the emails
	
	THIS IS OUR REST API 
	USING JSON FOR DATA FORMAT

***********************/

const username = '';
const password = '';
const darkSkyAPI = '30968187ff395abadb3d0b894cb5307e';

var express = require('express'); //Ensure our express framework has been added
var app = express();
var path = require("path");
const mailjet = require('node-mailjet').connect(username, password);

const request = require('request');

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
	user: 'brookestevens', //username
	password: 'postgres' //your password
};
//make a connection to the database
var db = pgp(dbConfig);

//convert this to something that the calendar can read
function convertEvents(a) {
	var eventList = [];
	a.forEach(i => {
		eventList.push({
			'title': i.eventname,
			'start': new Date(i.startdate),
			'end': new Date(i.enddate),
			id: i.id
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
})

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

//icons for the pages

app.get('/micromanage.svg', (req, res) => { res.sendFile(path.join(__dirname, '/public/micromanage.svg')) });

//this is registration page

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
app.get('/api', (req, res) => {
	db.task('get-everything', task => {
		return task.batch([
			task.any('SELECT * FROM myeventslist'),
			task.any('SELECT MAX(id) FROM myeventslist'),
			task.any('SELECT *  FROM myeventslist WHERE DATE(startdate) = CURRENT_DATE;'),
		]);
	})
		.then(data => {
			//success
			console.table(data);
			res.send({
				result: convertEvents(data[0]),
				id: data[1],
				today: convertEvents(data[2])
			});
		})
		.catch(error => {
			//error
			console.log(error);
		});
});

//add an event and return the updated list
app.post('/api/add', (req, res) => {
	var name = req.body.name;
	var start = req.body.start;
	var end = req.body.end;
	var id = req.body.id;
	console.log(`name is: ${name}, start is: ${start}, end is: ${end}, and id is: ${id}`);
	var insert_statement = `INSERT INTO myeventslist(id,eventname,startdate,enddate)VALUES(${id},'${name}','${start}','${end}');`;
	db.task('get-everything', task => {
		return task.batch([
			task.any(insert_statement),
			task.any('SELECT * FROM myeventslist'),
			task.any('SELECT MAX(id) FROM myeventslist')
		]);
	})
		.then(data => {
			res.send({
				data: convertEvents(data[1]),
				id: data[2],
			});
		})
		.catch(error => {
			//error
			console.log(error);
		});
});

//update one
app.get('/api/update', (req, res) => {
	var name = req.query.name;
	var start = req.query.start;
	var end = req.query.end;
	var id = req.query.id;
	var insert_statement = `UPDATE myeventslist SET eventname='${name}',startdate='${start}',enddate='${end}' WHERE id = ${id};`;
	console.log("inserting statement: ", insert_statement);
	db.task('get-everything', task => {
		return task.batch([
			task.any(insert_statement),
			task.any('SELECT * FROM myeventslist')
		]);
	})
		.then(data => {
			res.send({
				data: convertEvents(data[1]),
			});
		})
		.catch(error => {
			//error
			console.log(error);
		});
});

//delete it
app.get('/api/delete', (req, res) => {
	var id = req.query.id;
	var insert_statement = `DELETE FROM myeventslist WHERE id = ${id};`;
	console.log(insert_statement);
	db.task('get-everything', task => {
		return task.batch([
			task.any(insert_statement),
			task.any('SELECT * FROM myeventslist;')
		]);
	})
		.then(data => {
			res.send({
				data: convertEvents(data[1]),
			});
		})
		.catch(error => {
			//error
			console.log(error);
		});
});

app.listen(port, () => console.log(`App is listening on port ${port}!`));