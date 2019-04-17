/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
	Pg-Promise   - A database tool to help use connect to our PostgreSQL database
	
	THIS IS OUR REST API 
	USING JSON FOR DATA FORMAT

***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();
//define the port, create-react-app
const port = 3001; //react-app will use 3000

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'practicedb', //DB name here
	user: '', //username
	password: '' //your password
};
//make a connection to the database
var db = pgp(dbConfig);

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

//display the events
app.get('/api', (req,res) => {
  db.task('get-everything', task => {
    return task.batch([
				task.any('SELECT * FROM myeventslist'),
				task.any('SELECT MAX(id) FROM myeventslist'),
				task.any('SELECT *  FROM myeventslist WHERE DATE(startdate) = CURRENT_DATE;'),
    ]);
	})
	.then(data =>{
    //success
		console.table(data);
		res.send({
			result : convertEvents(data[0]),
			id : data[1],
			today : convertEvents(data[2])
		});
	})
	.catch(error =>{
		//error
		console.log(error);
	});
});

//add an event and return the updated list
app.post('/api/add', (req,res) => {
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
			id : data[2],
		});
	})
	.catch(error => {
			//error
			console.log(error);
	});
});

//update one
app.get('/api/update', (req,res) => {
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
app.get('/api/delete', (req,res) => {
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