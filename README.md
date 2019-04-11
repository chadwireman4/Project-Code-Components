# Project-Code-Components
All the code for our project


<h2>Application: Micro Manage &mu; </h2>
  Our applications is a web based Calendar that will hold user events and appointments. <br> <br>
  
  &mu; will notify users to upcoming appointments and color code events to urgency and importance. <br>
  We will have a task prediction feature, that given a specific task and how much time it will require to complete, &mu; will 
  split it into even portions before the due date and place in open spots in the users calender. <br>
  Users will be able to view their schedules by day, week, or month.
  
  ![alt text](micromupicture/micromu.png "Picture of Login Page")
  
  
<h3> Design and Architecture:</h3>
  <bold>Tools that are used:</bold>
  <ul>
  <li>HTML/CSS</li>
  <li>JavaScript</li>
  <li>React Framework</li>
  <li>Node.js</li>
  <li>Postgres SQL</li>
  <li>WordPress (Possibly)</li>
  </ul>
  
  <h3> Postgres Database <br> <br> </h3>
  <h2>Users Table</h2>
<table>
	<tr>
		<th>Columns</th>
		<th>Column Values/Description</th>
	</tr>
	<tr>
		<td>user_name</td>
		<td>varchar | Name of the user </td>
	</tr>
	<tr>
		<td>user_password</td>
		<td>varchar | stores user password for entry and authentication</td>
	</tr>
	<tr>
		<td>user_email</td>
		<td>varchar | stores user email for reminders and two factor authentication</td>
	</tr>
	<tr>
		<td>id</td>
		<td>serial | each user has unique id</td>
	</tr>
</table>
<p><br></p>

<h2>Appointments Table</h2>
<table>
	<tr>
		<th>Columns</th>
		<th>Column Values/Description</th>
	</tr>
	<tr>
		<td>name_of_event</td>
		<td>varchar | Name of event</td>
	</tr>
	<tr>
		<td>start_time</td>
		<td>timestamp without timezone | Date of the event</td>
	</tr>
	<tr>
		<td>length_of_event</td>
		<td>interval | Length of the event </td>
	</tr>
	<tr>
		<td>end_time</td>
		<td>timestamp without timezone | end date of the event </td>
	</tr>
	<tr>
		<td>urgency_of_event</td>
		<td>integer | Integer value that determines how important the event is, 0-100 with 100 being of the utmost importance</td>
	</tr>
	<tr>
		<td>color_of_event</td>
		<td>varchar | Stores values in a "#xxxxx" format so users can customize their calender</td>
	</tr>
	<tr>
		<td>id_of_event</td>
		<td>serial | unique id for each appointment</td>
	</tr>
	<tr>
		<td>user_id</td>
		<td>integer | Stores the unique id from users table</td>
	</tr>
	
</table>

  
  
  
  For our calender main page we are using Js and the React framework to create a simple and intuitive UI.
  Our login page is basic HTML and CSS.
  For connecting our Postgres database with the webpage we will be using Node.js, which will also be used to query the database.
  

<h3>Accomplished so far:</h3>
-[X] Login page <br>
-[X]Postgres DB Basic Layout<br>
-[X]Basic layout of calender <br>

<h3>What we are working on next:</h3>



  <ul>
  <li>Making the website a Progressive web application, allowing users to update their calender without internet accesss, and having those updates transfer to the database the next time they log onto the internet. </li>
  <li>Having Two-factor authentication for added security</li>
  <li>Text and/or email notifications</li>
  <li>Making Postgres db able to ssh into from anywhere</li>
  </ul>
  
  
  <h3>Individual Task Assignments</h3>
		<strong>Front End</strong><br>
		<bold>Brooke</bold><br>
		 <bold>Chad</bold><br><br>
		<strong>Back End</strong><br>
		 <bold>Ian</bold><br>
		 <bold>Chris</bold><br><br>
		<strong>Integration</strong><br>
		 <bold>Jacob</bold><br>
  		 <bold>Rahul</bold><br><br><br>
		 
		 
==============================================================================================================================
<h1>Presentation Rough Draft</h1>

<h2>Overview of MicroManage &mu;</h2>
  <h3>What Does MicroManage do?</h3>
    MicroManage&mu; is a scheduling service which combines an
      intuitive and minimilast UI to a Postgres database which allows
      users to plan out their days, weeks, months, and years. <br>

    
  <h3>Features:</h3>
  <ul>
    <li></li>
  </ul>


<h2>Front End =====> </h2>
  <h3>Tools Used:</h3>
  <ul>
    <li>React</li>
    <li>CSS</li>
  </ul>
  <h3>Why we chose these tools:</h3>

  <h3>Features: </h3>

<h2>Integration Layer =====></h2>

  <h3>Tools Used:</h3>
  <ul>
    <li>Node.js</li>
    <li>Express.js</li>
  </ul>
  <h3>Why we chose these tools:</h3>

  <h3>Features: </h3>

<h2>Back End ======></h2>


  <h3>Tools Used:</h3>
  <ul>
    <li>Postgres SQL</li>
  </ul>
  <h3>Why we chose these tools:</h3>
  We chose the Postgres Database because on the Heroku service it is 
    a database provided to us for free to use on our web app. 
  

  <h3>Features: </h3>

   One thing we were worried about when creating the databases, was that
      a person who gained access to a user's ID could access all of their
      information, which is why we decided to encrypt the users password and information.
    
  <h3>Database Model</h3>
  When a user creates a profile in our system, they are given a unique ID.
    The appointments table contains every users events, each row contains the unique user ID
    which is how we differentiate the appointments per user.
    The same goes for the user group table. 
  
  ![alt text](micromupicture/database_layout.png "Picture of Login Page")
  

