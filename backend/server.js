/***********************
  Load Components!

    Express      - A Node.js Framework
    Body-Parser  - A tool to help use parse the data in a post request
	Pg-Promise   - A database tool to help use connect to our PostgreSQL database
	Request      - Used to access the 3rd part APIs
	node-mailjet - Used for the emails
    
    THIS IS OUR REST API, Using JSON FOR DATA FORMAT

***********************/

const username = 'e5aa565bd39f8a0f6abbfbc4a971b757';
const password = '9765c52b455001784121034a200712b8';
const darkSkyAPI = '30968187ff395abadb3d0b894cb5307e';
var current_user_id = 0; //this will change

const express = require('express'); //Ensure our express framework has been added
const path = require("path");
const request = require('request');
const mailjet = require('node-mailjet').connect(username, password);
const bcrypt = require('bcrypt');
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
	user: 'rootuser',
	password: 'password'
};

//make a connection to the database
var db = pgp(dbConfig);

//testing
app.get('/test', (req, res) => { 
    app._router.stack.forEach(function(r){
        if (r.route && r.route.path){
            console.log(r.route.path)
        }
    })
});

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
					"Subject": `Time to get working on your task!`,
					"TextPart": "A Reminder from MicroManage!",
					"HTMLPart": `<h3> ${name} </h3>`
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
    console.log("Current user id is: ", current_user_id);
	res.sendFile(path.join(__dirname, '/public/user-log-in.html'));
});

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/registration.html'));
});


app.get('/add_group', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/add_group.html'));
});

app.get('/group_page', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/group_page.html'));
});

app.get('/group_appt', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/group_appt.html'));
});


//redirect to the registration page
//start on the login page
app.post('/', (req, res) => {
    //Checks if user-name OR email is in db
    //Returns true or false.
    console.log("Checking email and password for login page..");

    var password = req.body.Password;
    var email = req.body.Email;

    console.log("Password:" + password);
    console.log("Email:" + email );

    var query_exists = `SELECT EXISTS(SELECT user_email FROM users WHERE user_email = '${email}');`
    var query_statement = `SELECT user_email, user_password FROM users WHERE user_email = '${email}';`;

    db.one(query_exists)
    .then(uname => {
      if (uname.exists) {
        db.any(query_statement)
        .then( data => {
            console.log("Password hash:", data[0].user_password);
            console.log("Database queried successfully...");
            console.log(bcrypt.compareSync(password, data[0].user_password));
            res.send({
                data:bcrypt.compareSync(password, data[0].user_password),
                message:"Success",
            });
            res.end();
        })
        .catch( err => {
            console.log("Error: " + err );
        });
      }
      else {
      console.log("invalid email or password");
      res.send({
                data:uname.exists,
                message:"Failed",
            });
            res.end();
      }
    })
    .catch( err => {
      console.log("Error: " + err );
    });
});



//icons for page
app.get('/micromanage.svg', (req, res) => { res.sendFile(path.join(__dirname, '/public/micromanage.svg')) });

//display the events
app.get('/api/display-events-for-user', (req,res) => {

    var query = `SELECT * FROM appointments WHERE user_id = '${+current_user_id}'`;
    var query_two = `SELECT * FROM appointments WHERE user_id = '${+current_user_id}' 
    AND DATE(event_start_time) = CURRENT_DATE`;
    
  db.task('get-everything', task => {
    return task.batch([
                task.any(query),
                task.any(query_two),
                task.any(`SELECT user_name FROM USERS WHERE id = ${+current_user_id}`),
                task.any(`SELECT user_email FROM USERS WHERE id = ${+current_user_id}`)
    ]);
	})
	.then(data =>{
    //success
    	res.send({
                data: data[0],
                todaysEvents: data[1],
                name : data[2],
                email: data[3]
    	});
    	console.log("Sent events, success");

	})
	.catch(error =>{
		//error
		console.log(error);
	});
});

//Creating a new User Account
app.post('/api/check-user',(req,res) => {
    //Checks if user-name OR email is in db
    //Returns true or false.
    console.log("Checking email..");

    var name = req.body.Username;
	var email = req.body.Email;
	var password = req.body.Password;
  var pass_hash = bcrypt.hashSync(password, 5);
    
    console.log("Email:" + email );

    var query_statement = `SELECT EXISTS(SELECT 1 FROM users WHERE user_email = '${ email }');`;
    var query_statement_two = `INSERT INTO users(user_name , user_password,
        user_email) VALUES('${name}', '${pass_hash}', '${email}');`;
    var query_statement_three = `SELECT id FROM users WHERE user_email = '${email}'`;
    db.one(query_statement)
    .then( data => {
        console.log("Database queried successfully in check user...");
        console.log(data.exists);
        if(!data.exists){
            db.none(query_statement_two)
            .then( () => {
                db.one(query_statement_three)
                .then(data =>{
                    console.log("New User ID: " + data.id);
                    current_user_id = data.id;
                })
                .catch(er => console.log(er) );  
                res.redirect('http://localhost:3000'); //successfully added a new User
            })
            .catch(e => console.log(e));
        }
        else{
            console.log("user already exists");
            res.redirect('/registration');
        }
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});


app.get('/api/login-check',(req,res) => {
    //Checks if user-name OR email is in db
    //Returns true or false.
    console.log("Checking email and password for login page..");

    var password = req.query.user_password;
    var email = req.query.user_email;
    var pass_hash = bcrypt.hashSync(password, 5);

    console.log("Password: " + password);
    console.log("email:" + email );

    var query_statement = `SELECT EXISTS(SELECT 1 FROM users WHERE user_email = '${email}' AND user_password ='${password}' );`;


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


app.get('/api/validated',(req,res) => {
    //Checks if user-name OR email is in db
    //Returns true or false.
    console.log("Fetching user id with email..");

    var email = req.query.user_email;
    console.log("email:" + email );

    var query_statement = `SELECT id FROM users WHERE user_email = '${email}';`;
    db.one(query_statement)
    .then( data => {
        console.log("Database queried successfully... User Id: ", data.id);
        current_user_id = data.id;
        res.send({ 
            message:"Success",
        });
        res.end();
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});



app.get('/api/add-user',(req,res) => {
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


//Creating a new User Account
app.post('/api/check-group',(req,res) => {
    //Checks if user-name OR email is in db
    //Returns true or false.
    console.log("Checking email..");

    var group_name = req.body.group_name;
	var members = new Array();
    
    console.log(req.body.group_name);
    
    var potential_members = [req.body.member0, req.body.member1, req.body.member2, req.body.member3, req.body.member4, req.body.member5];
            
    for (var i = 0; i < 6; i++) {
        if (potential_members[i] === '') {
            break;
        }
        //potential_members[i] = "'" + potential_members[i] + "'";
        members.push(potential_members[i]);
    }
    
    console.log("members:" + members );

    var query_statement = `SELECT EXISTS(SELECT 1 FROM user_group WHERE group_name = '${ group_name }');`;
    var lookup_email_ids = `SELECT array_agg(id) FROM users WHERE user_email = ANY($1::varchar[]);`;
  console.log(members);
    db.any(lookup_email_ids, [members])
    .then( id_data => {
          var user_ids = id_data[0].array_agg;
          user_ids.push(current_user_id);
          console.log(user_ids);
        console.log(members);
        var query_statement_two = `INSERT INTO user_group(group_name , user_id_e) VALUES('${group_name}', ($1::integer[]));`;
        var query_statement_three = `SELECT group_id FROM user_group WHERE group_name = '${group_name}';`;
        db.one(query_statement)
        .then( data => {
            console.log("Database queried successfully in check group...");
            console.log(data.exists);
            if(!data.exists){
                db.none(query_statement_two, [user_ids])
                .then( () => {
                    db.one(query_statement_three)
                    .then(data =>{
                        console.log("New Group ID: " + data.group_id);
                    })
                    .catch(er => console.log(er) );  
                    res.redirect('http://localhost:3000'); //successfully added a new User
                })
                .catch(e => console.log(e));
            }
            else{
                console.log("group already exists");
                res.redirect('/add_group');
            }
        })
        .catch( err => {
            console.log("Error: " + err );
        });
    });
    });


app.get('/api/add-group',(req,res) => {
    //Adds User to user table
    console.log("Adding User.");
    var name = req.body.group_name;
    var password = null;
    var email = req.body.user_email;
    var user_id = null;
  
    var find_user_id = `SELECT user_id FROM USERS WHERE user_name = name`;
  
    db.one(find_user_id)
    .then( (data) => {
      user_id = data.user_id;
    }).
    catch( err => {
        console.log("Error: " + err );
    });

    var query_statement = `INSERT INTO user_group(group_name , group_password,
    user_id_e) VALUES('${name}', '${password}', '${user_id}');`;


    db.none(query_statement)
    .then( () => {
        console.log("Success.");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});


app.get('/api/group-validated',(req,res) => {
    //Checks if user-name OR email is in db
    //Returns true or false.
    console.log("Fetching user id with email..");

    var group_name = req.query.group_name;
    console.log("group_name:" + group_name );

    var query_statement = `SELECT group_id FROM users WHERE group_name = '${group_name}';`;
    db.one(query_statement)
    .then( data => {
        console.log("Database queried successfully... Group Id: ", data.group_id);
        current_user_id = data.group_id;
        res.send({ 
            message:"Success",
        });
        res.end();
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});



app.post('/api/add-appointment',(req,res) =>{
    //Requires user_id from front end
    //Adds appointment to appointments table
    console.log("Adding Event.");
    var name = req.body.event_name;
    var length = req.body.event_length;
    var start = req.body.event_start_time;
    var end = req.body.event_end_time;
    var urg = req.body.event_urgency;
    var color = "none";
    var group_n = req.body.group_name;
    console.log(`${start} , ${end} , ${length}, ${name}, ${urg}`);
    
    if (group_n === undefined) {

    var query_statement = `INSERT INTO appointments (
    user_id , 
    event_name , 
    event_length , 
    event_start_time , 
    event_end_time , 
    event_urgency ,
    event_color )
    VALUES ( 
        (SELECT id FROM users WHERE id = '${+current_user_id}'),
        '${ name }' ,
        '${ length } hour(s)' , 
        '${ start }' ,
        '${ end }' ,
        '${ urg }' ,
        '${ color }' );`;


        db.none(query_statement)
        .then( () => {
            res.send({status: 'success'});
        })
        .catch( err => {
            console.log("Error: " + err );
        });
    }
    else {
        
        console.log(group_n);
        var group_query = `SELECT user_id_e FROM user_group WHERE group_name = '${group_n}';`;
        db.one(group_query)
        .then( data => {
            var ids = data.user_id_e;
            for (var i = 0; i < ids.length; i++) {
        var query_statement = `INSERT INTO appointments (
    user_id , 
    event_name , 
    event_length , 
    event_start_time , 
    event_end_time , 
    event_urgency ,
    event_color )
    VALUES ( 
         '${ ids[i] }' ,
        '${ name }' ,
        '${ length } hour(s)' , 
        '${ start }' ,
        '${ end }' ,
        '${ urg }' ,
        '${ color }' );`;


        db.none(query_statement)
        .then( () => {
            res.send({status: 'success'});
        })
        .catch( err => {
            console.log("Error: " + err );
        });
            }
        });
        }
    res.redirect('http://localhost:3000');
});

app.get('/api/delete-user', (req,res) => {
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

app.get('/api/delete-event', (req,res) =>{
    console.log("Deleting event.");
    var event_name = req.query.event_name;
    var query_statement = `DELETE FROM ONLY 
    appointments WHERE user_id = '${+current_user_id}' AND event_name = '${event_name}';`;

    db.none(query_statement)
    .then( () => {
        console.log("Database queried successfully...");
        res.send({status: "success"});
    })
    .catch( err => {
        console.log("Error: " + err);
    });

});

app.get('/api/edit-event-details', (req,res) =>{
    var id = req.query.id;
    var name = req.query.name;
    var start = req.query.start;
    var end = req.query.end;
    var length = req.query.length;
    var query_statement = `UPDATE only appointments 
	SET event_name = '${name}', event_start_time = '${start}', event_end_time = '${end}', event_length = '${length} hour(s)'
	WHERE user_id = '${+current_user_id}' 
    AND event_id = '${id}';`;
    db.none(query_statement)
    .then( () => {
        res.send({status : "success"});
    })
    .catch( err => {
        console.log("Error: " + err );
    });
})

app.get('/api/edit-event-color',(req,res) =>{
    //Requires user_id from front end
  
    var name = req.body.event_name;
    var new_color = req.body.new_color;
            
    var query_statement = `UPDATE only appointments 
	SET event_color = '${new_color}'
	WHERE user_id = '${+current_user_id}' 
	AND event_name = '${name}';`;

    db.none(query_statement)
    .then( () => {
        console.log("Success");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});

app.get('/api/edit-user-password',(req,res) =>{
    //Requires user_id from front end
   
    var name = req.body.user_name;
    var new_user_password = req.body.new_user_password;
            
    var query_statement = `UPDATE only users
	SET user_password = '${{new_user_password}}'
	WHERE user_name = '${{user_name}}'
	AND user_id = '${+current_user_id}';`;

    db.none(query_statement)
    .then( () => {
        console.log("Success");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});


app.get('/api/edit-user-email',(req,res) =>{
    //Requires user_id from front end
    var name = req.body.user_name;
    var new_user_email = req.body.new_user_email;
            
    var query_statement = `UPDATE only users
	SET user_email = '${{new_user_email}}'
	WHERE user_name = '${{user_name}}'
	AND user_id = '${+current_user_id}';`;

    db.none(query_statement)
    .then( () => {
        console.log("Success");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});

app.get('/api/edit-user-name',(req,res) =>{
    //Requires user_id from front end
    var password = req.body.user_password;
    var new_user_name = req.body.new_user_name;
            
    var query_statement = `UPDATE only users
	SET user_name = '${{new_user_name}}'
	WHERE user_password = '${{password}}'
	AND user_id = '${+current_user_id}';`;

    db.none(query_statement)
    .then( () => {
        console.log("Success");
    })
    .catch( err => {
        console.log("Error: " + err );
    });
});

app.get('/api/logout',(req,res) => {
    current_user_id = 0;
    res.send({'status' : 'success'});
});

app.listen(port, () => console.log(`App is listening on port ${port}!`));
