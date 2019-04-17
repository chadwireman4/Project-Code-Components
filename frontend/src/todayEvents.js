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
                                <th>Name:</th><td>{item.title}</td>
                                <th>Start:</th><td> {new Date(item.start).toLocaleTimeString()} </td>
                                <th>End:</th><td>{new Date(item.end).toLocaleTimeString()}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        );
    }
}

export default DayEvents;
