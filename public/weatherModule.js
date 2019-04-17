//https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274
import React, { Component } from 'react'
import './index.css';

class WeatherModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summary : '',
            temperature : '',
            windSpeed : ''
        }
    }
    componentDidMount() {
        //lets get the data from darksky api
        fetch('/api/darksky')
            .then(res => res.json())
            .then(res => this.setState({
                summary : res.summary,
                temperature : res.temperature,
                windSpeed: res.windSpeed 
            }))
            .catch(err => console.log(err));
    }

    render(){
        return (
            <div> 
                <h2> Today's Weather</h2>
                <p>{this.state.summary}</p>
                <p>{this.state.temperature} degrees</p>
                <p>{this.state.windSpeed} mph</p>
            </div>
        );
    }
}
        
        
export default WeatherModule