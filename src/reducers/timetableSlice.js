import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_STARTTIME = 9;
const DEFAULT_ENDTIME = 18;
const DAY_MAP = {'Sun' : 0, 'Mon' : 1, 'Tue' : 2, 'Wed' : 3, 'Thu' : 4, 'Fri' : 5, 'Sat' : 6};

const initialState = {
    currentTableKey: 'table1',
    table1: {
        startTime: DEFAULT_STARTTIME,
        endTime: DEFAULT_ENDTIME,
        term: '2020 W1',
        matrix: initMatrix()
    },
    table2: {
        startTime: DEFAULT_STARTTIME,
        endTime: DEFAULT_ENDTIME,
        term: '2020 W2',
        matrix: initMatrix()
    }
}

export const timetableSlice = createSlice({
    name: 'timetable',
    initialState,
    reducers: {
        addSection: (state, action) => {
            const { tableKey, deptObj, course, section } = action.payload;
            addSection1(state, tableKey, deptObj, course, section)
        },
        removeSection: (state, action) => {
            const { tableKey, sectionObj } = action.payload;
            removeSection1(state, tableKey, sectionObj);
        }
    }
});

function initMatrix() {
    let matrix = new Array(7);
    const numRows = (DEFAULT_ENDTIME - DEFAULT_STARTTIME) * 2;
    for (let i = 0; i < numRows; i++) {
        matrix[i] = Array(7);
        for (let j = 0; j < 7; j++) {
            matrix[i][j] = initCell();
        }
    }
    return matrix;
}

function initCell() {
    return {
        occupied: false,
        replaced: false,
        rowSpan: 1,
        courseInfo: null,
        label: ''
    };
}

function addSection1(state, tableKey, deptObj, course, section) {
    const sectionObj = deptObj.courses[course].sections[section];
    const table = state[tableKey];
    let matrix = table.matrix;
    let startTime = table.startTime;
    let endTime = table.endTime;

    for (let classObj of sectionObj.classes) {
        const classStartTime = convertTimeToNumber(classObj.start);
        const classEndTime = convertTimeToNumber(classObj.end);
        const classLength = (classEndTime - classStartTime) * 2;
        const days = classObj.days.trim().split(' ');

        if (classStartTime < startTime) {
            insertRowsAtStart(matrix, classStartTime, startTime);
            startTime = classStartTime;
        }
        if (classEndTime > endTime) {
            insertRowsAtEnd(matrix, classEndTime, endTime);
            endTime = classEndTime;
        }

        let courseInfo = { deptObj, course, section };
        let label = getCellLabel(deptObj, course, section);

        days.forEach(day => {
            let column = DAY_MAP[day];
            let row = (classStartTime - startTime) * 2;

            updateCellsAdded(matrix, row, column, courseInfo, label, classLength);

            // cellObj.cell.addEventListener('click', e => {
            //     displaySectionRes(cellObj.deptObj, cellObj.courseObj, cellObj.sectionObj);
            // });
        });
    }

    table.currentTableKey = tableKey;
    table.startTime = startTime;
    table.endTime = endTime;
}

function removeSection1(state, tableKey, sectionObj) {
    const table = state[tableKey];
    let matrix = table.matrix;

    for (let classObj of sectionObj.classes) {
        const classStartTime = convertTimeToNumber(classObj.start);
        const days = classObj.days.trim().split(' ');

        days.forEach(day => {
            let column = DAY_MAP[day];
            let row = (classStartTime - table.startTime) * 2;
            updateCellsRemoved(matrix, row, column);
        });
    }
}

function updateCellsAdded(matrix, row, column, courseInfo, label, classLength) {
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

function updateCellsRemoved(matrix, row, column) {
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
            console.log('Nothing to remove');
        }
    }
}

function insertRowsAtStart(matrix, classStartTime, tableStartTime) {
    const numRows = (tableStartTime - classStartTime) * 2;
    for (let i = 0; i < numRows; i++) {
        matrix.splice(i, 0, Array(7));
        for (let j = 0; j < 7; j++) {
            matrix[0][j] = this.initCell();
        }
    }
}

function insertRowsAtEnd(matrix, classEndTime, tableEndTime) {
    const numRows = (classEndTime - tableEndTime) * 2;
    for (let i = 0; i < numRows; i++) {
        matrix.push(Array(7));
        for (let j = 0; j < 7; j++) {
            let lastIndex = matrix.length - 1;
            matrix[lastIndex][j] = this.initCell();
        }
    }
}

function getCellLabel(deptObj, course, section) {
    const sectionObj = deptObj.courses[course].sections[section];
    return `${sectionObj.sectionCode} (${sectionObj.activity})`;
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

export const { addSection, removeSection } = timetableSlice.actions;

export default timetableSlice.reducer;