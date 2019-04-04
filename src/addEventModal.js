//this is a child of the calendar Component
//use react-awesome-modal for the update/delete part
//create an alert that can accept more than argument
//props via Calendar
//Calendar sends a function that will handle the delete...
//these functions are update and delete...

import React, { Component } from 'react'
import Modal from 'react-awesome-modal';
import addIcon from './Add-icon-01.svg';

//Modal for adding an event
class AddEventModal extends Component {
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
            <section>
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

export default AddEventModal;