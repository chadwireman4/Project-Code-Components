import React, { Component } from 'react'
import './index.css';

class DayEvents extends Component {
    render() {
        return (
            <div>
                <h2>Today's Events: </h2>
                <table>
                    {this.props.eventList.map((item) => (
                        <tbody key={item.id}>
                            <tr>
                                <th>Name:</th><td>{item.event_name}</td>
                                <th>Start:</th><td> {new Date(item.event_start_time).toLocaleTimeString()} </td>
                                <th>Length:</th><td>{item.event_length}</td>
                                <th>Urgency:</th><td>{item.event_urgency}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        );
    }
}

export default DayEvents;
