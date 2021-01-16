import React, { Component } from 'react';
import Timetable from './Timetable';
import TimetableMenu from './TimetableMenu';
import deptObjj from './test';

const DEFAULT_STARTTIME = 9;
const DEFAULT_ENDTIME = 18;
const DAY_MAP = {'Sun' : 0, 'Mon' : 1, 'Tue' : 2, 'Wed' : 3, 'Thu' : 4, 'Fri' : 5, 'Sat' : 6};

export class TimetableControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTableKey: 'table1',
            table1: {
                startTime: DEFAULT_STARTTIME,
                endTime: DEFAULT_ENDTIME,
                term: '2020 W1',
                matrix: this.initMatrix()
            },
            table2: {
                startTime: DEFAULT_STARTTIME,
                endTime: DEFAULT_ENDTIME,
                term: '2020 W2',
                matrix: this.initMatrix()
            }
        };
    }

    initMatrix() {
        let matrix = new Array(7);
        const numRows = (DEFAULT_ENDTIME - DEFAULT_STARTTIME) * 2;
        for (let i = 0; i < numRows; i++) {
            matrix[i] = Array(7);
            for (let j = 0; j < 7; j++) {
                matrix[i][j] = this.initCell();
            }
        }
        return matrix;
    }

    initCell() {
        return {
            occupied: false,
            replaced: false,
            rowSpan: 1,
            courseInfo: null,
            label: ''
        };
    }

    addSection(tableKey, deptObj, course, section) {
        const sectionObj = deptObj.courses[course].sections[section];
        const table = this.state[tableKey];
        let updatedMatrix = table.matrix.slice();
        let startTime = table.startTime;
        let endTime = table.endTime;

        for (let classObj of sectionObj.classes) {
            const classStartTime = convertTimeToNumber(classObj.start);
            const classEndTime = convertTimeToNumber(classObj.end);
            const classLength = (classEndTime - classStartTime) * 2;
            const days = classObj.days.trim().split(' ');
    
            if (classStartTime < startTime) {
                this.insertRowsAtStart(updatedMatrix, classStartTime, startTime);
                startTime = classStartTime;
            }
            if (classEndTime > endTime) {
                this.insertRowsAtEnd(updatedMatrix, classEndTime, endTime);
                endTime = classEndTime;
            }

            let courseInfo = { deptObj, course, section };
            let label = getCellLabel(deptObj, course, section);
    
            days.forEach(day => {
                let column = DAY_MAP[day];
                let row = (classStartTime - startTime) * 2;

                this.updateCellsAdded(updatedMatrix, row, column, courseInfo, label, classLength);

                // cellObj.cell.addEventListener('click', e => {
                //     displaySectionRes(cellObj.deptObj, cellObj.courseObj, cellObj.sectionObj);
                // });
            });
        }

        this.setState({
            currentTableKey: tableKey,
            [tableKey]: {
                startTime,
                endTime,
                term: table.term,
                matrix: updatedMatrix
            }
        });
    }

    removeSection(tableKey, sectionObj) {
        const table = this.state[tableKey];
        let updatedMatrix = table.matrix.slice();

        for (let classObj of sectionObj.classes) {
            const classStartTime = convertTimeToNumber(classObj.start);
            const days = classObj.days.trim().split(' ');
    
            days.forEach(day => {
                let column = DAY_MAP[day];
                let row = (classStartTime - table.startTime) * 2;
                this.updateCellsRemoved(updatedMatrix, row, column);
            });
        }
    
        // let index = this.addedSections.indexOf(sectionObj.sectionCode);
        // this.addedSections.splice(index, 1);
        this.setState({
            currentTableKey: tableKey,
            [tableKey]: {
                startTime: table.startTime,
                endTime: table.endTime,
                term: table.term,
                matrix: updatedMatrix
            }
        });
    }

    updateCellsAdded(matrix, row, column, courseInfo, label, classLength) {
        const cell = matrix[row][column];
        cell.occupied = true;
        cell.rowSpan = classLength;
        cell.courseInfo = courseInfo;
        cell.label = label;

        for (let i = 1; i < classLength; i++) {
            let cellToReplace = matrix[row+i][column];
            if (!cellToReplace.occupied) {
                cellToReplace.replaced = true;
                cellToReplace.occupied = true;
            } else {
                throw new Error('Cannot Remove - cell is occupied');
            }
        }
    }

    updateCellsRemoved(matrix, row, column) {
        const cell = matrix[row][column];
        const rowSpan = cell.rowSpan;
        cell.occupied = false;
        cell.rowSpan = 1;
        cell.courseInfo = null;
        cell.label = '';
        
        for (let i = 1; i < rowSpan; i++) {
            let cellToAdd = matrix[row+i][column];
            if (cellToAdd.occupied) {
                cellToAdd.occupied = false;
                cellToAdd.replaced = false;
            } else {
                console.log('Nothiing to remove');
            }
        }
    }

    insertRowsAtStart(matrix, classStartTime, tableStartTime) {
        const numRows = (tableStartTime - classStartTime) * 2;
        for (let i = 0; i < numRows; i++) {
            matrix.splice(i, 0, Array(7));
            for (let j = 0; j < 7; j++) {
                matrix[0][j] = this.initCell();
            }
        }
    }

    insertRowsAtEnd(matrix, classEndTime, tableEndTime) {
        const numRows = (classEndTime - tableEndTime) * 2;
        for (let i = 0; i < numRows; i++) {
            matrix.push(Array(7));
            for (let j = 0; j < 7; j++) {
                let lastIndex = matrix.length - 1;
                matrix[lastIndex][j] = this.initCell();
            }
        }
    }

    switchTable = (tableKey) => {
        if (this.state.currentTableKey !== tableKey) {
            this.setState({ currentTableKey: tableKey });
        }
    }

    isVisible(tableKey) {
        return this.state.currentTableKey === tableKey;
    }

    render() {
        const table1 = this.state.table1;
        const table2 = this.state.table2;
        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div id="timetable-wrapper">
                <TimetableMenu currentTableKey={this.state.currentTableKey} switchTable={this.switchTable} />
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
        this.addSection('table1', deptObjj, '110','L1F');
        this.addSection('table1', deptObjj, '210','103');
    }

    addSectionTest2() {
        this.addSection('table1', deptObjj, '210','103');
        this.addSection('table1', deptObjj, '110','L1F');
    }

    removeSectionTest() {
        const sectionObj1 = deptObjj.courses['110'].sections['L1F'];
        const sectionObj2 = deptObjj.courses['210'].sections['103'];
        this.removeSection('table1', sectionObj1);
        this.removeSection('table1', sectionObj2);
    }

    removeSectionTest2() {
        const sectionObj1 = deptObjj.courses['110'].sections['L1F'];
        const sectionObj2 = deptObjj.courses['210'].sections['103'];
        this.removeSection('table1', sectionObj2);
        this.removeSection('table1', sectionObj1);
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

export default TimetableControl;
