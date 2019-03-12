//http://intljusticemission.github.io/react-big-calendar/examples/index.html#intro
//https://codesandbox.io/s/l98v2jjqjz


import React from 'react';
import './index.css';
//import App from './App';
//import * as serviceWorker from './serviceWorker';

//use big calendar react package
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
moment.locale('en-GB');
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

const MyCalendar = () => (
    <div id = "calendar">
      <BigCalendar
        localizer = {localizer}
        events={[
          {
            'title': 'My event',
            'allDay': false,
            'start': new Date(2018, 0, 1, 10, 0), // 10.00 AM
            'end': new Date(2018, 0, 1, 14, 0), // 2.00 PM 
          }
        ]}
        step={60}
        view='week'
        views={['week']}
        min={new Date(2008, 0, 1, 8, 0)} // 8.00 AM => save this in the DB
        max={new Date(2008, 0, 1, 17, 0)} // Max will be 6.00 PM!
        date={new Date(2018, 0, 1)}
      />
    </div>
);

export default MyCalendar