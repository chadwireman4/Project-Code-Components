import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//import the progress module
import ProgressModule from "./TaskProgress";

//import the calendar module
import MyCalendar from "./calendar";

ReactDOM.render(
    <div>
        <MyCalendar />
        <br/>
        <ProgressModule />
    </div>, 
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
