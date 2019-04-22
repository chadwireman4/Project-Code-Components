//this is a child of the calendar Component
//use react-awesome-modal for the update/delete part
//create an alert that can accept more than argument
//props via Calendar
//Calendar sends a function that will handle the delete...
//these functions are update and delete...


import React, { Component } from 'react'
import Modal from 'react-awesome-modal';

class MyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateName: this.props.selectedName,
            updateStart:'',
            updateEnd:'',
            visible: false,
            id:[],
            eventList: []
        }
        this.closeModal = this.closeModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.isValidDate = this.isValidDate.bind(this);
    }
    //make the inputs not read only
    handleInputChange = (event) => {
        const target = event.target;
        const value = event.target.value;
        const _name = target.name;
        this.setState({ [_name]: value });
    }

    //handle user input and update state
    renderEditForm() {
        return (
            <div class="form">
                <span>Event Title</span>
                <input type="text" name = "updateName" value={this.state.updateName} onChange = {this.handleInputChange}/>
                <span>Start Time</span>
                <input type="datetime-local" name = "updateStart" value={this.state.updateStart} onChange = {this.handleInputChange}/>
                <span>End Time</span>
                <input type="datetime-local" name = "updateEnd" value={this.state.updateEnd} onChange = {this.handleInputChange}/>
            </div>
        );
    }


    isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    //lift state up to parent
    //no need to send updated data because its already in the DB
    //probably should check that users putting in valid stuff
    editModal() {
        console.log("editing the modal");
        if(this.isValidDate(new Date(this.state.updateStart)) === false) return;
        if(this.isValidDate(new Date(this.state.updateEnd)) === false) return;
        var data = {
            id: this.props.index,
            updateName: this.state.updateName,
            updateStart: this.state.updateStart.replace('T',' '),
            updateEnd:this.state.updateEnd.replace('T',' '),
        }
        console.table(data);
        //send it out once everything looks good
        fetch(`/api/update?id=${data.id}&name=${data.updateName}&start=${data.updateStart}&end=${data.updateEnd}`)
        .then(res => res.json())
        .then(res => this.props.onEdit(res.data))
        .catch(e => {console.log(e)})
        this.closeModal();
    }

    //lift state up to parent
    //delete this item by making api call
    //return the updated event list
    deleteModal() {
        console.log("deleting the event");

        fetch(`/api/delete?id=${this.props.index}`)
        .then(res => res.json())
        .then(res => this.props.onDelete(res.data))
        .catch(e => {console.log(e)})

        this.closeModal();
    }
    closeModal() {
        this.setState({ visible: false });
        this.props.onToggle(this.state.visible);
    }

    render() {
        return (
            <section>
                <Modal
                    visible={this.props.toggle} //this changes based on what the calender event is
                    width="500"
                    height="590"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}>
                    <div class="form">
                        <h2>Event Details</h2>
                        {this.renderEditForm()}
                        <button onClick={() => this.editModal()}>Edit</button>
                        <button id="delete" onClick={() => this.deleteModal()}>Delete</button>
                    </div>
                </Modal>
            </section>
        );
    }
}

export default MyModal;

