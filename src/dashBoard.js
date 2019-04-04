//Parent component that will hold all of the UI modules
//Child Components: Calendar, Progress bar

import React, { Component } from 'react'
import './index.css';

//import the calendar module
import MyCalendar from "./calendar";



class DashBoard extends Component{
    //very important to use map when rendering an array of objects!
    //needs a unique key, which will be the id in the database
    render(){
        return(
            <MyCalendar setName = {this.handleSetName} />      
        );
    }
}

export default DashBoard

