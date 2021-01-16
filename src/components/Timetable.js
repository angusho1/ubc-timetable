import React, { Component } from 'react';
import TimetableRow from './TimetableRow';

export class Timetable extends Component {

    renderDays() {
        return this.props.days.map((day) => (<th key={day} className="day-header">{day}</th>));
    }

    renderTimetableRows() {
        let t = 0;
        const startTime = this.props.startTime;
        const endTime = this.props.endTime;
        const numRows = (endTime - startTime) * 2;

        let tableRows = [];

        for (let i = 0; i < numRows; i++) {
            let timeSlot;
            if (i % 2 === 0) {
                timeSlot = `${(startTime + t)}:00`;
            } else {
                timeSlot = `${(startTime + t)}:30`;
                t++;
            }
            tableRows.push(
                <TimetableRow key={timeSlot} cells={this.props.matrix[i]} timeSlot={timeSlot} days={this.props.days}/>
            );
        }

        return tableRows;
    }

    determineClasses() {
        let classList = 'timetable';
        if (!this.props.visible) {
            classList = `${classList} invisible`;
        }
        return classList;
    }

    render() {
        return (
            <table className={this.determineClasses()}>
                <thead>
                    <tr>
                        <th width="50px" className="day-header"/>
                        {this.renderDays()}
                    </tr>
                </thead>
                <tbody>
                    {this.renderTimetableRows()}
                </tbody>
            </table>
        )
    }
}

export default Timetable;
