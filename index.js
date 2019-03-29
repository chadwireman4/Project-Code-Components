/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
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

//var router = express.Router(); //this is for chaining routes 

//res.json is similar to res.send but former will covnert objects to json

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'practicedb', //DB name here
	user: 'brookestevens',
	password: 'postgres'
};
//make a connection to the database
var db = pgp(dbConfig);

//you can send an array of stuff! this is a test query
app.get('/api', (req,res) => {
  db.task('get-everything', task => {
    return task.batch([
        task.any('SELECT * FROM store'),
        task.any('SELECT * FROM dates')
    ]);
  })

	.then(data =>{
    //success
		console.table(data);
		res.send({
			result : data[0],
      express : 'hello from express!',
      dates: data[1]
		});
	})
	.catch(error =>{
		//error
		console.log(error);
	});
});

//this is an array of dates that Im experimenting with 
// app.get('/api', (req,res) => {
//   db.any('SELECT * FROM dates;')
//   .then( data => {
//     //success
//     console.table(data);
//     res.send({
//       result : '',
//       express : '',
//       dates : data
//     });
//   })
//   .catch( error =>{
//     //error
//     console.log(error);
//   });
// });



// app.get('/api', (req, res) => {
//     res.send({
//         express: 'Hello From Express'
//     });
// });
//module.exports = router;

app.listen(port, () => console.log(`App is listening on port ${port}!`))