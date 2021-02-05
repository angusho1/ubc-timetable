import React, { Component } from 'react';

export class TimetableCell extends Component {
    determineClasses() {
        let classList = 'timetable-cell';
        if (this.props.columnIndex % 2 === 0) {
            classList = `${classList} white-cell`;
        }
        const cellInfo = this.props.cellInfo;
        if (cellInfo.occupied && !cellInfo.replaced) {
            classList = `${classList} added-cell`;
        }

        return classList;
    }

    render() {
        return (
            <td rowSpan={this.props.cellInfo.rowSpan} className={this.determineClasses()}>
                {this.props.cellInfo.label}
            </td>
        );
    }
}

export default TimetableCell;