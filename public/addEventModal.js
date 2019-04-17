//////////////////////////////////////////
//
//  this is the module for the modal classes
//  Reminder icon and Add event icon here
//
//
///////////////////////////////////////////

import React, {Component} from 'react'
import Modal from 'react-awesome-modal';
import addIcon from './Add-icon-01.svg';
import reminderIcon from './reminder.png';

//Modal for setting a reminder

export class SetReminderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            time : '',
            taskName :  'nothing'
        }
    this.handleInputChange = this.handleInputChange.bind(this);  
    this.setReminder = this.setReminder.bind(this);  
    this.handleSubmit = this.handleSubmit.bind(this);
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
    handleInputChange = (event) => {
        const target = event.target;
        const value = event.target.value;
        const _name = target.name;
        this.setState({ [_name]: value });
    }
    handleSubmit(event){
        event.preventDefault();
        this.setReminder();
        this.closeModal();
    }
    setReminder(){
        var name = this.state.taskName;
        var time = this.state.time;
        var email = this.props.email;
        var countDownDate = new Date(time).getTime();
        console.log(`time is: ${time} and countDown is: ${countDownDate}`);

        // Update the count down every 1 second
        var x = setInterval(function() {
        var now = new Date().getTime();
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
        var data = {
            name: name,
            email: email, //this.props.email
        }
        if (distance < 0) {
            clearInterval(x);
            alert("time is up");
            //the post request here
            fetch('/api/email', {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers:{
                  'Content-Type': 'application/json'
                }
              })
              .then(res => res.json())
              .then(res => this.props.onAddEvent(res.data, res.id))
              .catch(e => console.log(e))
        }
        }, 1000);
    }

    render() {
        return (
            <section>
                <img id = 'reminderIcon' className = "icons" src={reminderIcon} alt={'reminder icon'} onClick={() => this.openModal()}></img>
                <Modal
                    visible={this.state.visible}
                    width="400"
                    height="300"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div>
                        <h2>Set a time</h2>
                        <br/>
                        Enter a time to be a reminded: <input type="datetime-local" value = {this.state.time} name= "time" onChange = {this.handleInputChange}/> 
                        <br/>
                        Enter reminder thing: <input type="text" value = {this.state.taskName} name= "taskName" onChange = {this.handleInputChange}/> 
                        <br/>
                        <button type= "button" onClick = {this.handleSubmit}> Submit </button>
                    </div>
                </Modal>
            </section>
        )
    }
}



//Modal for adding an event
export class AddEventModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            eventName: "",
            startDate: "",
            endDate: "",
            id:[],
            eventList :[]
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isValidDate = this.isValidDate.bind(this);
        this.closeModal = this.closeModal.bind(this);
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
    //make the inputs not read only
    handleInputChange = (event) => {
        const target = event.target;
        const value = event.target.value;
        const _name = target.name;
        this.setState({ [_name]: value });
    }

    isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    //add a new event into the DB
    //first we check that the user input was valid
    //then we turn the strings into something the DB can read
    //also increment the ID
    //sending the data object after turning it into JSON
    handleSubmit = (event) => {
        event.preventDefault();
        //error check for empty fields -- they must all be filled out
        if (this.state.eventName === "") return;
        if (this.isValidDate(new Date(this.state.startDate)) === false) return;
        if(this.isValidDate(new Date(this.state.endDate)) === false) return;
        //passed all of the checks
        var newId = this.props.id[0].max;
        var data = {
            name: this.state.eventName,
            start: this.state.startDate.replace('T',' '),
            end: this.state.endDate.replace('T',' '),
            id: ++newId
        }
        //lift state up to update the calendar
        fetch('/api/add', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
          })
          .then(res => res.json())
          .then(res => this.props.onAddEvent(res.data, res.id))
          .catch(e => console.log(e))

        this.closeModal();
        window.location.reload(); //force page to reload
    }



    renderAddForm() {
        return (
            <div>
                Event Name: <input type="text" name="eventName" value={this.state.eventName} onChange={this.handleInputChange} />
                <br />
                Start: <input type="datetime-local" name="startDate" value={this.state.startDate} onChange={this.handleInputChange} />
                <br />
                End: <input type="datetime-local" name="endDate" value={this.state.endDate} onChange={this.handleInputChange} />
                <br />
                <button type="button" value=" Add New Event" onClick={this.handleSubmit}>Add Event</button>
            </div>
        );
    }

    render() {
        return (
            <section id="real-button">
                <img id = 'addIcon' className = "icons" src={addIcon} alt={'add event icon'} onClick={() => this.openModal()}></img>
                <Modal
                    visible={this.state.visible}
                    width="400"
                    height="300"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div>
                        <h2>Add An Event</h2>
                        {this.renderAddForm()}
                    </div>
                </Modal>
            </section>
        )
    }
}
