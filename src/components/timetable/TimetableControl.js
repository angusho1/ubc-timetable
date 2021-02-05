import React, { Component } from 'react';
import { connect } from 'react-redux';
import Timetable from './Timetable';
import TimetableMenu from './TimetableMenu';

export class TimetableControl extends Component {

    switchTable = (tableKey) => {
        // if (this.state.currentTableKey !== tableKey) {
        //     this.setState({ currentTableKey: tableKey });
        // }
    }

    isVisible(tableKey) {
        // return this.state.currentTableKey === tableKey;
        return this.props.currentTableKey === tableKey;
    }

    render() {
        const table1 = this.props.table1;
        const table2 = this.props.table2;
        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div id="timetable-wrapper">
                <TimetableMenu currentTableKey={this.props.currentTableKey} switchTable={this.switchTable} />
                <Timetable startTime={table1.startTime} endTime={table1.endTime} term={table1.term} matrix={table1.matrix} days={days} visible={this.isVisible('table1')} />

                <Timetable startTime={table2.startTime} endTime={table2.endTime} term={table2.term} matrix={table2.matrix} days={days} visible={this.isVisible('table2')} />
            </div>
        )
    }
}

const mapState = state => ({
    currentTableKey: state.timetable.currentTableKey,
    table1: state.timetable.table1,
    table2: state.timetable.table2
});

const mapDispatch = {
    
}

export default connect(mapState, mapDispatch)(TimetableControl);
