import React, { Component } from 'react';

export class TimetableMenu extends Component {
    renderTimetableButtons() {
        return this.props.timetables.map(table => {
            const tableKey = table.tableKey;
            const term = table.term;
            return (
                <button className="timetable-menu-btn" 
                        key={tableKey}
                        onClick={(e) => this.switchTable(tableKey)}>
                        {term}
                </button>
            );
        });
    }

    switchTable = tableKey => {
        this.props.switchTable({ tableKey });
    }

    render() {
        return (
            <div className="timetable-menu">
                {this.renderTimetableButtons()}
            </div>
        )
    }
}

export default TimetableMenu;
