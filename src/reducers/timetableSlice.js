import { createSlice } from '@reduxjs/toolkit';
import { AcademicSession, AcademicTerm, AcademicYear } from '../data/AcademicCalendar';

const DEFAULT_STARTTIME = 9;
const DEFAULT_ENDTIME = 18;
const DAY_MAP = {'Sun' : 0, 'Mon' : 1, 'Tue' : 2, 'Wed' : 3, 'Thu' : 4, 'Fri' : 5, 'Sat' : 6};

const initialState = {
    currentTableKey: 'table1',
    sessions: [
        {
            year: 2020,
            season: 'W',
            addedSections: []
        }
    ],
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
            addSectionMain(state, sectionObj);
        },
        removeSection: (state, action) => {
            const { sectionObj } = action.payload;
            removeSectionMain(state, sectionObj);
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

function filterClassesByTerm(sectionObj, term) {
    return sectionObj.classes.filter(classObj => classObj.term === term.getTermNumber().toString());
}

function addSectionMain(state, sectionObj) {
    const sectionCode = sectionObj.sectionCode;
    const session = getSectionSession(sectionObj);
    const stateSession = getStateSession(state, session);

    if (sectionAdded(stateSession, sectionCode)) {
        throw new Error(`Cannot add - Section '${sectionCode}' is already in session '${session.getString()}'`);
    }

    const editQueue = getTablesToEdit(state, sectionObj, session);
    if (hasTimetableConflicts(editQueue)) {
        console.log(`Cannot add section ${sectionCode}`);
        return;
    };

    for (let { classObjs, table } of editQueue) {
        addSectionToTable(table, classObjs, sectionObj);
        state.currentTableKey = table.tableKey;
    }

    stateSession.addedSections.push(sectionCode);
}

function hasTimetableConflicts(editQueue) {
    for (let { classObjs, table } of editQueue) {
        let matrix = table.matrix;
        let startTime = table.startTime;
        let endTime = table.endTime;

        for (let classObj of classObjs) {
            if (isInvalid(classObj.start) || isInvalid(classObj.end)) break;
    
            const classStartTime = convertTimeToNumber(classObj.start);
            const classEndTime = convertTimeToNumber(classObj.end);
            const classLength = (classEndTime - classStartTime) * 2;
            const days = getDaysFromClass(classObj);
    
            for (let day of days) {
                if (isDayAlternating(day)) { // TODO: Add exception for days with alternating weeks
                    day = day.replace('*', '');
                    day = day.replace('^', '');
                }
                let column = DAY_MAP[day];
                let row = (classStartTime - startTime) * 2;
            
                for (let i = 0; i < classLength; i++) {
                    if (row + i < 0 || row + i >= (endTime - startTime) * 2) {
                        continue; // if the rows aren't in the timetable yet, they can be safely added without conflicts
                    }
                    let cellToReplace = matrix[row+i][column];
                    if (cellToReplace.occupied) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function addSectionToTable(table, classObjs, sectionObj) {
    let matrix = table.matrix;
    let startTime = table.startTime;
    let endTime = table.endTime;

    for (let classObj of classObjs) {
        if (isInvalid(classObj.start) || isInvalid(classObj.end)) break;

        const classStartTime = convertTimeToNumber(classObj.start);
        const classEndTime = convertTimeToNumber(classObj.end);
        const classLength = (classEndTime - classStartTime) * 2;
        const days = getDaysFromClass(classObj);

        startTime = adjustStartTime(classStartTime, startTime, matrix);
        endTime = adjustEndTime(classEndTime, endTime, matrix);

        let label = getCellLabel(sectionObj);
        let start = startTime;

        days.forEach(day => {
            if (isDayAlternating(day)) { // TODO: Add exception for days with alternating weeks
                day = day.replace('*', '');
                day = day.replace('^', '');
            }

            let column = DAY_MAP[day];
            let row = (classStartTime - start) * 2;

            updateCellsAdded(matrix, row, column, sectionObj, label, classLength);
        });
    }

    table.startTime = startTime;
    table.endTime = endTime;
}

function removeSectionMain(state, sectionObj) {
    const sectionCode = sectionObj.sectionCode;
    const session = getSectionSession(sectionObj);
    const stateSession = getStateSession(state, session);

    if (!sectionAdded(stateSession, sectionObj.sectionCode)) {
        throw new Error(`Cannot remove - Section '${sectionCode}' is not session '${session.getString()}'`);
    }

    const editQueue = getTablesToEdit(state, sectionObj, session);

    for (let { classObjs, table } of editQueue) {
        removeSectionFromTable(table, classObjs);
        state.currentTableKey = table.tableKey;
    }

    stateSession.addedSections.splice(stateSession.addedSections.indexOf(sectionCode), 1);
}

function removeSectionFromTable(table, classObjs) {
    let matrix = table.matrix;

    for (let classObj of classObjs) {
        if (isInvalid(classObj.start) || isInvalid(classObj.end)) break;

        const classStartTime = convertTimeToNumber(classObj.start);
        const days = getDaysFromClass(classObj);

        days.forEach(day => {
            if (isDayAlternating(day)) { // TODO: Add exception for days with alternating weeks
                day = day.replace('*', '');
                day = day.replace('^', '');
            }
            let column = DAY_MAP[day];
            let row = (classStartTime - table.startTime) * 2;
            updateCellsRemoved(matrix, row, column);
        });
    }
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
            throw new Error('The cell is occupied and cannot be replaced');
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

function adjustStartTime(classStartTime, startTime, matrix) {
    if (classStartTime < startTime) {
        insertRowsAtStart(matrix, classStartTime, startTime);
        startTime = classStartTime;
    }
    return startTime;
}

function adjustEndTime(classEndTime, endTime, matrix) {
    if (classEndTime > endTime) {
        insertRowsAtEnd(matrix, classEndTime, endTime);
        endTime = classEndTime;
    }
    return endTime;
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

function sectionAdded(stateSession, sectionCode) {
    return stateSession.addedSections.includes(sectionCode);
}

function getDaysFromClass(classObj) {
    return classObj.days.trim().split(' ');
}

function getSectionSession(sectionObj) {
    const sessionObj = sectionObj.session;
    const academicYear = new AcademicYear(sessionObj.year);
    return new AcademicSession(academicYear, sessionObj.season);
}

function getStateSession(state, session) {
    return state.sessions.find(stateSession => {
        return `${stateSession.year}${stateSession.season}` === session.getString();
    });
}

function getTablesToEdit(state, sectionObj, session) {
    const terms = getTerms(sectionObj, session);
    return terms.map(term => {
        const classObjs = filterClassesByTerm(sectionObj, term);
        const table = getTableByKey(state, term.getTermString());
        return { classObjs, table };
    });
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

function isInvalid(input) {
    if (typeof input === 'string' || input instanceof String) {
        return /^\s*$/.test(input);
    } else {
        return input === null;
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

function isDayAlternating(day) {
    const asterisk = /\*/;
    const caret = /\^/;
    return (asterisk.test(day) || caret.test(day));
}

export const { addSection, removeSection, switchTable } = timetableSlice.actions;

export default timetableSlice.reducer;