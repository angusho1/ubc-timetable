import React, { Component } from 'react';

export class TimeSlotCell extends Component {
    render() {
        return (
            <td className="time-cell">
                {this.props.timeSlot}
            </td>
        )
    }
}

export default TimeSlotCell;
