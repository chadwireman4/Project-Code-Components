//https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274
import React, {Component} from 'react'
import './index.css';
import Modal from 'react-awesome-modal';

var counter = 0;

class AddEventModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }
    openModal() {
        this.setState({
            visible: true
        });
    }
    closeModal() {
        this.setState({
            visible: false
        });
    }
    render() {
        return (
            <section>
                <button onClick={() => this.openModal()}>Set a Reminder</button>
                <Modal
                    visible={this.state.visible}
                    width="400"
                    height="300"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div>
                        Set a time
                    </div>
                </Modal>
            </section>
        )
    }
}


class ProgressModule extends Component{
    constructor(props){
        super(props);
        this.state = {
            a : {backgroundColor : "red"},
            b : {backgroundColor : "red"},
            c : {backgroundColor : "red"},
            d : {backgroundColor : "red"}
        }

        this.addProgress = this.addProgress.bind(this);
        this.setReminder = this.setReminder.bind(this);
    }
    addProgress(){
        counter++;
        if(counter === 5) counter = 0; 
        console.log("counter is: " + counter);
        if(counter === 1) this.setState({a : {backgroundColor : "green"}}); 
        else if(counter === 2) this.setState({b : {backgroundColor : "green"}}); 
        else if(counter === 3) this.setState({c : {backgroundColor : "green"}}); 
        else if(counter === 4) this.setState({d : {backgroundColor : "green"}}); 
        alert("yay more progress!");    
    }

    setReminder(){
        alert("set a time");
        
    }

    renderProgressBar(){
        return(
            <div id = "progressBar" >
                <div className = "circle " style = {this.state.a} >25%</div>
                <div className = "circle " style = {this.state.b}>50%</div>
                <div className = "circle " style = {this.state.c}>75%</div>
                <div className = "circle " style = {this.state.d}>100%</div>
            </div>
        );
    }

    renderProgressDescription(){
        return(
            <div>
                <p> You need to work on this task for 30 more minutes to finish on time </p>
            </div>
        );
    }
    renderAddProgress(){
        return(
            <AddEventModal/>
        );
    }

    render(){
        return(
            <div>
                <h2>{this.props.eventName}</h2>
                {this.renderProgressDescription()}
                {this.renderProgressBar()}
                {this.renderAddProgress()}
            </div>
        );
    }
}

export default ProgressModule