This is the start to our backend API:

Note: Since we are using express and React, they have to be running at the same time for the app to work. We have express listening on port 3001 and then React can continue to listen on port 3000. We tell React to proxy the requests to port 3001. We can use the same server (localhost).

We are using JSON as our data transfer format
We are using Express as our framework.
We are using pg-promise package so we can connect to postgres
We will have seperate routes for:

Using GET requests for everything, but the login page which will use a POST request.

Get Routes:

/add
/add/formsub
/edit
/edit/formsub
/view
/delete
/delete/formsub

POST Routes:

/login
/login/submit

In React, we will will call a method in ComponentDidMount method 
called fetch which will get the response object grom the GET request

Then we access the content of the response object with json() method and update the state of the components with it 

