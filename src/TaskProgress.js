//https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274
import React, {Component} from 'react'
import './index.css';

//component for the Progress bar


class ProgressModule extends Component{
    renderProgressBar(){
        return(
            <div id = "progressBar" >
                <div className = "circle" >25%</div>
                <div className = "circle" >50%</div>
                <div className = "circle" >75%</div>
                <div className = "circle" >100%</div>
            </div>
        );
    }

    renderEventName(){
        return(
            <div>
                Upcoming Event
            </div>
        );
    }

    renderProgressDescription(){
        return(
            <div>
                <p> You are almost done with this task! </p>
            </div>
        );
    }

    render(){
        return(
            <div id = "progressModule" >
                {this.renderEventName()}
                {this.renderProgressDescription()}
                {this.renderProgressBar()}
            </div>
        );
    }
}

export default ProgressModule