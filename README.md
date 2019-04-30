# Project-Code-Components
All the code for our project

Client side code written in React.js 

<h1>Presentation Rough Draft</h1>

<h2>Overview of MicroManage &mu;</h2>
  <h3>What Does MicroManage do?</h3>
    MicroManage&mu; is a scheduling service which combines an
      intuitive and minimilast user interface to a database which allows
      users to plan out their days, weeks, months, and years. <br>

    
  <h3>Features:</h3>
  <ul>
    <li> Dark mode </li>
    <li> Edit events </li>
    <li> Email reminders </li>
    <li> Weather Updates </li>
  </ul>
  
<h1>How to run</h1>
Open two terminals. <br>
cd into the backend and frontend directories <br>
Then run in both directories: <br>

npm install <br>

npm start






<h2>Front End =====> </h2>
  <h3>Tools Used:</h3>
  <ul>
    <li>React</li>
    <li>CSS</li>
  </ul>
  <h3>Why we chose these tools:</h3>



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
    <li>BCrypt Password Hasing</li>
  </ul>
  <h3>Why we chose these tools:</h3>
  We chose the Postgres Database because on the Heroku service it is 
    a database provided to us for free to use on our web app. 
  

  <h3>Features:  </h3>

   One thing we were worried about when creating the databases, was that
      a person who gained access to a user's ID could access all of their
      information, which is why we decided to encrypt the users password and information.
      <br>
      We are using Bcrypt to hash the user password, for improved security.  
    
  <h3>Database Model</h3>
  When a user creates a profile in our system, they are given a unique ID.
    The appointments table contains every users events, each row contains the unique user ID
    which is how we differentiate the appointments per user.
    The same goes for the user group table. 
  
  
