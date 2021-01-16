import React, { Component } from 'react';

export class TimetableMenu extends Component {
    render() {
        return (
            <div>
                <button className="timetable-menu" 
                        id="term-1" 
                        onClick={() => this.props.switchTable('table1')}>Term 1
                </button>
                <button className="timetable-menu" 
                        id="term-2" 
                        onClick={() => this.props.switchTable('table2')}>Term 2
                </button>
            </div>
        )
    }
}

export default TimetableMenu;
