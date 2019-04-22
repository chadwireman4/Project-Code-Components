///////////////////////////////////////////////
//
//  This is the main component that renders all of the others
//  has the calendar in it
//  weather and today's events are children
//
//
///////////////////////////////////////////////// 

import React, { Component } from 'react'
import './index.css';
import './dark.css';

//use big calendar react package and custom CSS file
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import './react-big-calendar.css';

//import the pop up modals
import MyModal from './popUpModal';
import {AddEventModal,SetReminderModal} from './addEventModal';


//import todays events
import DayEvents from './todayEvents';

//import the progress module
import WeatherModule from './weatherModule';

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
      myEventsList: [{
        'title' : 'testing',
        'start' : new Date(2019, 3, 9),
        'end' : new Date(2019, 3, 9)
      }],
      todaysEvents:[],
      email : 'origamiguru98@gmail.com'
    }
    this.handleSelectSlot = this.handleSelectSlot.bind(this);
    this.update = this.update.bind(this);
    this.toggle = this.toggle.bind(this);
    this.add = this.add.bind(this);
    this.getID = this.getID.bind(this);
    this.convertToCalendarFormat = this.convertToCalendarFormat.bind(this);
  }

  componentDidMount() {
    //lets get the data in the db
    fetch('/api/display-events-for-user')
    .then(res => res.json())
    .then(res => this.setState({
      myEventsList : this.convertToCalendarFormat(res.data),
      todaysEvents : res.todaysEvents
    }))
    .catch(err => console.log(err));
  }

  //toggling for the modal
  toggle = (n) => {
    this.setState({ clicked: n });
  }

  //updating the event given the start,end, and name of event
  update(updatedEvents, updatedTodaysEvents) {
    console.log("updated");
    console.log("new event list is: ", updatedEvents);
    this.setState({ myEventsList: updatedEvents, todaysEvents: updatedTodaysEvents });
  }

  //updatng state
  add(newEvent, updatedTodaysEvents) {
    console.log("new event List is is: ", newEvent);
    this.setState({
      myEventsList: newEvent,
      todaysEvents : updatedTodaysEvents 
    });
  }

  //our own method to get the id of a name of an item
  getID(indexToFind) {
    var index;
    this.state.myEventsList.forEach( i => {
      if(i.title === indexToFind){
        index = i.id;
      }
    });
    console.log(index);
    if (typeof index !== "undefined") return index;
    else return -1;
  }

  //edit/delete existing data
  //pass the name of the current event up to the parent so it can pass
  //it down to the task module child via props
  //get the selected id so we can edit or delete it
  handleSelectSlot = (slotInfo) => {
    this.setState({idToUpdate : this.getID(slotInfo.title)});
    this.setState({nameToUpdate: slotInfo.title});
    !this.state.clicked ? this.setState({ clicked: true }) : this.setState({ clicked: false });
  }

  //convert the events
  convertToCalendarFormat(a){
    console.table(a);
    var eventList = [];
    a.forEach( i => {
      eventList.push({
        'title' : i.event_name,
        'start' : new Date(i.event_start_time),
        'end' : new Date(i.event_end_time),
        id : i.event_id
      })
    })
    console.table(eventList);
    return eventList;
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
        onUpdate={this.update}
        index = {this.state.idToUpdate}
        selectedName = {this.state.nameToUpdate}
      />
    );
  }

  renderAddEvent() {
    return (
      <AddEventModal onAddEvent={this.add} />
    )
  }

  renderReminder() {
    return (
      <SetReminderModal email = {this.state.email} />
    )
  }

  renderTodaysEvents(){
    console.table(this.state.todaysEvents);
    return(
      <DayEvents eventList = {this.state.todaysEvents} />
    )
  }

  renderWeatherModule(){
    return(
      <WeatherModule eventName = {this.state.nameToUpdate} />
    );
  }

  render() {
    //render the modal if its clicked
    if (this.state.clicked) {
      return (
        <React.Fragment>
          {this.renderAddEvent()}
          {this.renderReminder()}
          {this.renderModal()}
          <div id="other-content">
            <div id="weatherToday">
              {this.renderWeatherModule()}
            </div>
            <div id="todayEvents">
              {this.renderTodaysEvents()}
            </div>
          </div>
          <div id="calendar-wrapper">
            <div id="calendar">
              {this.renderBigCalendar()}
            </div>
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {this.renderAddEvent()}
        {this.renderReminder()}
        <div id="other-content">
          <div id="weatherToday">
            {this.renderWeatherModule()}
          </div>
          <div id="todayEvents">
            {this.renderTodaysEvents()}
          </div>
        </div>
        <div id="calendar-wrapper">
          <div id="calendar">
            {this.renderBigCalendar()}
          </div>
        </div>
      </React.Fragment>
    );
  }
}


export default MyCalendar;