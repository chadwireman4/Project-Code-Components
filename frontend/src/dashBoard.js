//Parent component that will hold all of the UI modules
//Child Components: Calendar, Progress bar

import React, {Component} from 'react'
import './index.css';
import './dark.css';

//import the calendar module
import MyCalendar from "./calendar";

class DashBoard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: "u hackerman"
        }
    this.handleSetName = this.handleSetName.bind(this);  
    }
    handleSetName(userName){ 
        console.log(userName);
        this.setState({name : userName })
    }
    render(){
        return(
            <React.Fragment>
                <h1 className = "welcomeMessage" > Welcome: {this.state.name} </h1>
                <MyCalendar setName = {this.handleSetName}/> 
            </React.Fragment>     
        );
    }
}

export default DashBoard