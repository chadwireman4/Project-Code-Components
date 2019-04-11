//http://intljusticemission.github.io/react-big-calendar/examples/index.html#intro
//https://codesandbox.io/s/l98v2jjqjz
//https://vickykedlaya.wordpress.com/2017/07/31/how-to-book-a-meeting-slot-using-react-big-calendar/
//issues with statements getting called before promise is returned... look at the es7 async 

import React, { Component } from 'react'
import './index.css';
//import * as serviceWorker from './serviceWorker';

//use big calendar react package
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

//import the pop up modals
import MyModal from './popUpModal';
import AddEventModal from './addEventModal';

//import todays events
import DayEvents from './todayEvents';

//import the progress module
import ProgressModule from "./TaskProgress";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
moment.locale('en-GB');
const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

//date object for JS used => date(year, month, day, hours, min ); //start at 0

class MyCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameToUpdate: 'Event Name',
      idToUpdate: '',
      clicked: false,
      id: [],
      myEventsList: [],
      todaysEvents:[]
    }
    this.handleSelectSlot = this.handleSelectSlot.bind(this);
    this.update = this.update.bind(this);
    this.toggle = this.toggle.bind(this);
    this.add = this.add.bind(this);
    this.getID = this.getID.bind(this);
  }

  componentDidMount() {
    //lets get the data in the db
    fetch('/api')
    .then(res => res.json())
    .then(res => this.setState({
      myEventsList: res.result,
      id: res.id,
      todaysEvents: res.today
    }))
    .catch(err => console.log(err));    
  }

  //toggling for the modal
  toggle = (n) => {
    this.setState({ clicked: n });
  }

  //updating the event given the start,end, and name of event
  update(updatedEvents) {
    console.log("updated");
    console.log("new event list is: ", updatedEvents);
    this.setState({ myEventsList: updatedEvents });
  }

  //updatng state
  add(newEvent, newId) {
    console.log("new event is: ", newEvent);
    console.log("new id: ", newId);
    this.setState({
      myEventsList: newEvent,
      id: newId
    });
  }

  //our own method to get the id of a name of an item
  getID(indexToFind) {
    var index;
    this.state.myEventsList.forEach(i => {
      if (i.title === indexToFind) {
        index = i.id;
      }
    })
    if (typeof index !== "undefined") return index;
    else return -1;
  }

  //edit/delete existing data
  //pass the name of the current event up to the parent so it can pass
  //it down to the task module child via props
  //get the selected id so we can edit or delete it
  handleSelectSlot = (slotInfo) => {
    var t =new Date (slotInfo.start)
    console.log(slotInfo.title);
    console.log(t.toLocaleDateString());
    this.setState({idToUpdate : this.getID(slotInfo.title)});
    this.setState({nameToUpdate: slotInfo.title});
    //alert(`Event: ${slotInfo.title} Starts at: ${slotInfo.start} and is: ${typeof slotInfo.start}`);
    !this.state.clicked ? this.setState({ clicked: true }) : this.setState({ clicked: false });
  }

  //this will render the calendat to the screen
  //used props to get parent state
  renderBigCalendar = () => {
    return (
      <BigCalendar
        selectable={true}
        onSelectEvent={slotInfo => this.handleSelectSlot(slotInfo)} //user clicks on existing event
        localizer={localizer}
        events={this.state.myEventsList} //shows the events created
        step={60}
        views={['month', 'week', 'day']} //view by month,week,day
        min={new Date(2019, 3, 1, 8)} // 8.00 AM
        max={new Date(2019, 3, 1, 20)} // Max will be 8 pm
        defaultDate={new Date()} //make the current date today
      />
    );
  }

  //send in all of the props to the popUpModal Component
  //need index from the object clicked on
  renderModal = () => {
    return (
      //pass props to child
      <MyModal toggle={this.state.clicked}
        onToggle={this.toggle}
        onEdit={this.update}
        onDelete={this.update}
        index = {this.state.idToUpdate}
        selectedName = {this.state.nameToUpdate}
      />
    );
  }

  renderAddEvent() {
    return (
      <AddEventModal id={this.state.id} onAddEvent={this.add} />
    )
  }

  renderTodaysEvents(){
    console.table(this.state.todaysEvents);
    return(
      <DayEvents eventList = {this.state.todaysEvents} />
    )
  }

  renderProgressModule(){
    return(
      <ProgressModule eventName = {this.state.nameToUpdate} />
    );
  }

  render() {
    //render the modal if its clicked
    if (this.state.clicked) {
      return (
        <div>
          {this.renderAddEvent()}
          {this.renderModal()}
          <div id="calendar">
            {this.renderBigCalendar()}
          </div>
          <div id="other-content">
            <div id="todayEvents">
              {this.renderTodaysEvents()}
            </div>
            <div id="progressModule">
              {this.renderProgressModule()}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div id="grid">
        {this.renderAddEvent()}
        <div id="calendar">
          {this.renderBigCalendar()}
        </div>
        <div id="other-content">
          <div id="todayEvents">
              {this.renderTodaysEvents()}
          </div>
          <div id="progressModule">
              {this.renderProgressModule()}
          </div>
        </div>
      </div>
    );
  }
}

export default MyCalendar;