import React, { Component } from 'react';
import TimeSlotCell from './TimeSlotCell.js';
import TimetableCell from './TimetableCell.js';

export class TimetableRow extends Component {
    renderCells() {
        let timetableCells = [];
        const cells = this.props.cells;
        const days = this.props.days;
        for (let i = 0; i < days.length; i++) {
            if (!cells[i].replaced) {
                timetableCells.push(
                    <TimetableCell key={i} columnIndex={i} day={days[i]} cellInfo={cells[i]} />
                );
            }
        }
        return timetableCells;
    }

    render() {
        return (
            <tr>
                <TimeSlotCell timeSlot={this.props.timeSlot}/>
                {this.renderCells()}
            </tr>
        )
    }
}

export default TimetableRow;
