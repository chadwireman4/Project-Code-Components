//////////////////////////////////////////
//
//  this is the module for the modal classes
//  Reminder icon and Add event icon here
//
//
///////////////////////////////////////////

import React, {Component} from 'react'
import Modal from 'react-awesome-modal';
import addIcon from './icon-add.svg';
import reminderIcon from './icon-reminder.svg';

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
                    width="500"
                    height="450"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div class="form">
                        <h2>Add Reminder</h2>
                        <span>Title</span> <input type="text" value = {this.state.taskName} name= "taskName" onChange = {this.handleInputChange}/>
                        <span>Reminder Time</span><input type="datetime-local" value = {this.state.time} name= "time" onChange = {this.handleInputChange}/>
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
            urg : 0,
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
    //sending the data object after turning it into JSON
    handleSubmit = (event) => {
        event.preventDefault();
        //error check for empty fields -- they must all be filled out
        var lengthOfEvent = Math.abs(new Date(this.state.endDate).getTime() - new Date(this.state.startDate).getTime())/3600000;
        if(lengthOfEvent <= 0) return; 
        if (this.state.eventName === "") return;
        if (this.isValidDate(new Date(this.state.startDate)) === false) return;
        if(this.isValidDate(new Date(this.state.endDate)) === false) return;
        //passed all of the checks
        var data = {
            event_name: this.state.eventName,
            event_start_time: this.state.startDate.replace('T',' '),
            event_end_time: this.state.endDate.replace('T',' '),
            event_urgency:this.state.urg,
            event_length: lengthOfEvent
        }
        console.table(data);
        //add it into the DB
        fetch('/api/add-appointment', {
            method: 'POST', 
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }})
            .then(res => res.json())
            .then(res => {
                if(res.status === 'success'){
                    fetch('/api/display-events-for-user')
                    .then(res => res.json())
                    .then(res => this.props.onAddEvent(res.data, res.todaysEvents)) //send back the updated event list
                    .catch(e => console.log(e));
                }
                else{
                    console.log("error updating data in DB");
                }
            })
            .catch(e => console.log(e));

        this.closeModal();
        window.location.reload(); //force page to reload
    }



    renderAddForm() {
        return (
            <div class="form">
                <span>Title</span> <input type="text" name="eventName" value={this.state.eventName} onChange={this.handleInputChange} />
                <span>Start</span> <input type="datetime-local" name="startDate" value={this.state.startDate} onChange={this.handleInputChange} />
                <span>End</span> <input type="datetime-local" name="endDate" value={this.state.endDate} onChange={this.handleInputChange} />
                <span>Urgency</span> <input type="number" name="urg" min = "0" max = "10" value={this.state.urg} onChange={this.handleInputChange} />
                <button type="button" value=" Add New Event" onClick={this.handleSubmit}>Add Event</button>
            </div>
        );
    }

    render() {
        return (
            <section>
                <img id = 'addIcon' className = "icons" src={addIcon} alt={'add event icon'} onClick={() => this.openModal()}></img>
                <Modal
                    visible={this.state.visible}
                    width="500"
                    height="550"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div class="form">
                        <h2>Add Event</h2>
                        {this.renderAddForm()}
                    </div>
                </Modal>
            </section>
        )
    }
}

