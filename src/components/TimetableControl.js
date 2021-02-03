import React, { Component } from 'react';
import { connect } from 'react-redux';
import Timetable from './Timetable';
import TimetableMenu from './TimetableMenu';
// import deptObjj from './test';

const DEFAULT_STARTTIME = 9;
const DEFAULT_ENDTIME = 18;
const DAY_MAP = {'Sun' : 0, 'Mon' : 1, 'Tue' : 2, 'Wed' : 3, 'Thu' : 4, 'Fri' : 5, 'Sat' : 6};

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

                <button onClick={() => this.addSectionTest()}>+ Add Section 1</button>
                <button onClick={() => this.removeSectionTest()}>- Remove Section 1</button>
                <button onClick={() => this.addSectionTest2()}>+ Add Section 2</button>
                <button onClick={() => this.removeSectionTest2()}>- Remove Section 2</button>
            </div>
        )
    }

    addSectionTest() {
        // this.addSection('table1', deptObjj, '110','L1F');
        // this.addSection('table1', deptObjj, '210','103');
    }

    addSectionTest2() {
        // this.addSection('table1', deptObjj, '210','103');
        // this.addSection('table1', deptObjj, '110','L1F');
    }

    removeSectionTest() {
        // const sectionObj1 = deptObjj.courses['110'].sections['L1F'];
        // const sectionObj2 = deptObjj.courses['210'].sections['103'];
        // this.removeSection('table1', sectionObj1);
        // this.removeSection('table1', sectionObj2);
    }

    removeSectionTest2() {
        // const sectionObj1 = deptObjj.courses['110'].sections['L1F'];
        // const sectionObj2 = deptObjj.courses['210'].sections['103'];
        // this.removeSection('table1', sectionObj2);
        // this.removeSection('table1', sectionObj1);
    }
}

/**
 * converts time string formatted as "HH:MM" and returns a number
 * ex: 14:30 -> 14.5
 * 
 * @param {string} str  the time string to convert
 * 
 * @returns {number} the converted time
 */
function convertTimeToNumber(str) {
    const timeArray = str.split(':');
    const hours = parseInt(timeArray[0]);
    const minutes = parseInt(timeArray[1]) / 60;
    // console.log(`${str} -> ${hours + minutes}`);
    return hours + minutes;
}

function getCellLabel(deptObj, course, section) {
    const sectionObj = deptObj.courses[course].sections[section];
    return `${sectionObj.sectionCode} (${sectionObj.activity})`;
}

const mapStateToProps = state => ({
    currentTableKey: state.timetable.currentTableKey,
    table1: state.timetable.table1,
    table2: state.timetable.table2
});

const mapDispatchToProps = {
    
}

// export default TimetableControl;
export default connect(mapStateToProps, mapDispatchToProps)(TimetableControl);
