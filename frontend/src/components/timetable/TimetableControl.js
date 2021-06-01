import './Timetable.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Timetable from './Timetable';
import TimetableMenu from './TimetableMenu';
import { switchTable } from '../../reducers/timetableSlice';

export class TimetableControl extends Component {

    findTable(tables, tableKey) {
        return tables.find(table => table.tableKey === tableKey);
    }

    render() {
        const timetables = this.props.timetables;
        const currentTableKey = this.props.currentTableKey;
        const currentTable = this.findTable(timetables, currentTableKey);
        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div id="timetable-wrapper">
                <TimetableMenu currentTableKey={currentTableKey}
                                timetables={timetables} 
                                switchTable={this.props.switchTable} />
                <Timetable table={currentTable} days={days} />
            </div>
        )
    }
}

const mapState = state => ({
    currentTableKey: state.timetable.currentTableKey,
    timetables: state.timetable.tables
});

export default connect(mapState, { switchTable })(TimetableControl);
