import { createSlice } from '@reduxjs/toolkit';
import { AcademicSession, AcademicTerm, AcademicYear } from '../data/AcademicCalendar';

const DEFAULT_STARTTIME = 9;
const DEFAULT_ENDTIME = 18;
const DAY_MAP = {'Sun' : 0, 'Mon' : 1, 'Tue' : 2, 'Wed' : 3, 'Thu' : 4, 'Fri' : 5, 'Sat' : 6};
const DEFAULT_YEAR = 2020;
const DEFAULT_SESSION = new AcademicSession(DEFAULT_YEAR, 'W');

const initialState = {
    currentTableKey: 'table1',
    addedSections: [],
    tables: [
        {
            tableKey: 'table1',
            startTime: DEFAULT_STARTTIME,
            endTime: DEFAULT_ENDTIME,
            term: '2020 W1',
            matrix: initMatrix()
        },
        {
            tableKey: 'table2',
            startTime: DEFAULT_STARTTIME,
            endTime: DEFAULT_ENDTIME,
            term: '2020 W2',
            matrix: initMatrix()
        }
    ]
}

export const timetableSlice = createSlice({
    name: 'timetable',
    initialState,
    reducers: {
        addSection: (state, action) => {
            const { sectionObj } = action.payload;
            addSectionToTables(state, sectionObj);
        },
        removeSection: (state, action) => {
            const { sectionObj } = action.payload;
            removeSection1(state, sectionObj);
        },
        switchTable: (state, action) => {
            const tableKey = action.payload.tableKey;
            state.currentTableKey = tableKey;
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
        sectionObj: null,
        label: ''
    };
}

function getTableByKey(state, termKey) {
    const table = state.tables.find(table => //table.tableKey === tableKey &&
                                            table.term === termKey);
    if (table === null) {
        throw new Error(`Table of term '${termKey}' not found`);
    }
    return table;
}

function addSectionToTables(state, sectionObj) {
    const deptKey = sectionObj.courseObj.deptObj.subjCode;
    const courseKey = sectionObj.courseObj.course;
    const sectionKey = sectionObj.section;
    const sectionCode = `${deptKey} ${courseKey} ${sectionKey}`;
    const sessionObj = sectionObj.session;
    const academicYear = new AcademicYear(sessionObj.year);
    const session = new AcademicSession(academicYear, sessionObj.season);

    if (sectionAdded(state, sectionCode)) {
        throw new Error(`Cannot add - Section '${sectionCode}' is already in session '${session.getString()}'`);
    }

    const terms = getTerms(sectionObj, session);

    for (let term of terms) {
        let classObjs = sectionObj.classes.filter(classObj => classObj.term === term.getTermNumber().toString());

        const table = getTableByKey(state, term.getTermString());
        let matrix = table.matrix;
        let startTime = table.startTime;
        let endTime = table.endTime;

        for (let classObj of classObjs) {
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

            let label = getCellLabel(sectionObj);
            let start = startTime;

            days.forEach(day => {
                let column = DAY_MAP[day];
                let row = (classStartTime - start) * 2;

                updateCellsAdded(matrix, row, column, sectionObj, label, classLength);
            });
        }

        state.currentTableKey = table.tableKey;
        table.startTime = startTime;
        table.endTime = endTime;
    }

    state.addedSections.push(`${deptKey} ${courseKey} ${sectionKey}`);
}

function removeSection1(state, sectionObj) {
    const deptKey = sectionObj.courseObj.deptObj.subjCode;
    const courseKey = sectionObj.courseObj.course;
    const sectionKey = sectionObj.section;
    const sectionCode = `${deptKey} ${courseKey} ${sectionKey}`;
    const sessionObj = sectionObj.session;
    const academicYear = new AcademicYear(sessionObj.year);
    const session = new AcademicSession(academicYear, sessionObj.season);

    if (!sectionAdded(state, sectionObj.sectionCode)) {
        throw new Error(`Cannot remove - Section '${sectionCode}' is not session '${session.getString()}'`);
    }

    const terms = getTerms(sectionObj, session);

    for (let term of terms) {
        let classObjs = sectionObj.classes.filter(classObj => classObj.term === term.getTermNumber().toString());

        const table = getTableByKey(state, term.getTermString());
        let matrix = table.matrix;

        for (let classObj of classObjs) {
            const classStartTime = convertTimeToNumber(classObj.start);
            const days = classObj.days.trim().split(' ');

            days.forEach(day => {
                let column = DAY_MAP[day];
                let row = (classStartTime - table.startTime) * 2;
                updateCellsRemoved(matrix, row, column);
            });
        }

        state.currentTableKey = table.tableKey;
    }

    state.addedSections.splice(state.addedSections.indexOf(sectionObj.sectionCode), 1);
}

function sectionAdded(state, sectionCode) {
    return state.addedSections.includes(sectionCode);
}

function updateCellsAdded(matrix, row, column, sectionObj, label, classLength) {
    const cell = matrix[row][column];
    cell.occupied = true;
    cell.rowSpan = classLength;
    cell.sectionObj = sectionObj;
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
    cell.sectionObj = null;
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
        matrix.unshift(Array(7));
        for (let j = 0; j < 7; j++) {
            matrix[0][j] = initCell();
        }
    }
}

function insertRowsAtEnd(matrix, classEndTime, tableEndTime) {
    const numRows = (classEndTime - tableEndTime) * 2;
    for (let i = 0; i < numRows; i++) {
        matrix.push(Array(7));
        let lastIndex = matrix.length - 1;
        for (let j = 0; j < 7; j++) {
            matrix[lastIndex][j] = initCell();
        }
    }
}

function getTerms(sectionObj, session) {
    const termNumbers = getSectionTermNumbers(sectionObj.classes);
    
    let terms = [];
    for (let termNumber of termNumbers) {
        const academicTerm = new AcademicTerm(session, termNumber);
        terms.push(academicTerm);
    }
    return terms;
}

function getSectionTermNumbers(classObjs) {
    let termNumbers = [];
    if (classObjs.length === 1 && classObjs[0].term === '1-2') {
        termNumbers.push('1');
        termNumbers.push('2');
    } else if (classObjs.length > 0) {
        for (let classObj of classObjs) {
            let term = classObj.term;
            if (!termNumbers.includes(term)) {
                termNumbers.push(term);
            }
        }
    } else {
        throw new Error(`No classes found for this section`);
    }
    return termNumbers;
}

function getCellLabel(sectionObj) {
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

export const { addSection, removeSection, switchTable } = timetableSlice.actions;

export default timetableSlice.reducer;