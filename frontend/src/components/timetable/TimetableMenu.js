import React, { Component } from 'react';

export class TimetableMenu extends Component {
    determineBtnClasses(tableKey) {
        let className = "timetable-menu-btn";
        if (this.props.currentTableKey === tableKey) {
            className = `${className} active`;
        }
        return className;
    }

    renderTimetableButtons() {
        return this.props.timetables.map(table => {
            const tableKey = table.tableKey;
            const term = table.term;
            return (
                <button className={this.determineBtnClasses(tableKey)}
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
