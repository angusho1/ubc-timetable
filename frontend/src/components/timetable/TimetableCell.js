import React, { Component } from 'react';
import { connect } from 'react-redux';
import { displaySection } from '../../reducers/searchSlice';

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

    displaySection = e => {
        if (this.props.cellInfo.occupied) {
            const sectionObj = this.props.cellInfo.sectionObj;
            this.props.displaySection(sectionObj);
        }
    }

    render() {
        return (
            <td rowSpan={this.props.cellInfo.rowSpan}
                className={this.determineClasses()}
                onClick={this.displaySection}>
                {this.props.cellInfo.label}
            </td>
        );
    }
}

// export default TimetableCell;
export default connect(null, { displaySection })(TimetableCell);