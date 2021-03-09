import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SearchType } from '../data/SearchType';

const initialState = {
    objectOnDisplay: null,
    typeObjectOnDisplay: null,
    currentSession: {
        year: 2020,     // TODO: Change hardcode
        season: 'W'
    },
    status: 'idle' | 'pending' | 'successful' | 'failed',
    error: null
}

export const searchDept = createAsyncThunk('search/searchDept', 
    async (searchData) => {
        const deptKey = formatKey(searchData.dept);
        const session = searchData.session;
        return searchDeptByKey(deptKey, session);
    }
);

export const searchCourse = createAsyncThunk('search/searchCourse', 
    async (searchData) => {
        const deptKey = formatKey(searchData.dept);
        const courseKey = formatKey(searchData.course);
        const session = searchData.session;
        return searchCourseByKey(deptKey, courseKey, session);
    }
);

export const searchSection = createAsyncThunk('search/searchSection', 
    async (searchData) => {
        const deptKey = formatKey(searchData.dept);
        const courseKey = formatKey(searchData.course);
        const sectionKey = formatKey(searchData.section);
        const session = searchData.session;
        return searchSectionByKey(deptKey, courseKey, sectionKey, session);
    }
);

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        displaySection: (state, action) => {
            state.typeObjectOnDisplay = SearchType.SECTION;
            state.objectOnDisplay = action.payload;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: {
        [searchDept.pending]: state => {
            setPendingSearch(state, SearchType.DEPT);
        },
        [searchDept.fulfilled]: (state, action) => {
            setSuccessfulSearch(state, action);
        },
        [searchDept.rejected]: setFailedSearch,

        [searchCourse.pending]: state => {
            setPendingSearch(state, SearchType.COURSE);
        },
        [searchCourse.fulfilled]: (state, action) => {
            setSuccessfulSearch(state, action);
        },
        [searchCourse.rejected]: setFailedSearch,

        [searchSection.pending]: state => {
            setPendingSearch(state, SearchType.SECTION);
        },
        [searchSection.fulfilled]: (state, action) => {
            setSuccessfulSearch(state, action);
        },
        [searchSection.rejected]: setFailedSearch
    }
});


function setPendingSearch(state, type) {
    state.status = 'pending';
    state.typeObjectOnDisplay = type;
}

function setSuccessfulSearch(state, action) {
    state.status = 'successful';
    state.objectOnDisplay = action.payload;
}

function setFailedSearch(state, action) {
    state.status = 'failed';
    state.error = action.error.message;
    state.objectOnDisplay = null;
}

// TODO: Use session in actual search
function searchDeptByKey(deptKey, session) {
    return fetchData()
        .then(data => {
            const deptSearchResult = data.departments[deptKey];
            if (!deptSearchResult) {
                throw new Error(`'${deptKey}' is not a valid department`);
            }
            deptSearchResult['session'] = session;
            return deptSearchResult;
        });
}

function searchCourseByKey(deptKey, courseKey, session) {
    return searchDeptByKey(deptKey)
        .then(deptSearchResult => {
            const courseSearchResult = deptSearchResult.courses[courseKey];
            if (!courseSearchResult) {
                throw new Error(`'${deptKey} ${courseKey}' is not a valid course`);
            }
            courseSearchResult['deptObj'] = copyDeptProperties(deptSearchResult);
            courseSearchResult['session'] = session;
            return courseSearchResult;
        });
}

function searchSectionByKey(deptKey, courseKey, sectionKey, session) {
    return searchCourseByKey(deptKey, courseKey)
        .then(courseSearchResult => {
            const sectionSearchResult = courseSearchResult.sections[sectionKey];
            if (!sectionSearchResult) {
                throw new Error(`'${deptKey} ${courseKey} ${sectionKey}' is not a valid section`);
            }
            sectionSearchResult['courseObj'] = copyCourseProperties(courseSearchResult);
            sectionSearchResult['session'] = session;
            return sectionSearchResult;
        });
}

function copyDeptProperties(deptObj) {
    let result = {};
    for (let prop in deptObj) {
        if (Object.prototype.hasOwnProperty.call(deptObj, prop) && prop !== 'courses') {
            result[prop] = deptObj[prop];
        }
    }
    return result;
}

function copyCourseProperties(courseObj) {
    let result = {};
    for (let prop in courseObj) {
        if (Object.prototype.hasOwnProperty.call(courseObj, prop) && prop !== 'sections') {
            result[prop] = courseObj[prop];
        }
    }
    return result;
}

/**
 * @todo move API calls into a service
 */
function fetchData() {
    return fetch('/courseData.json')
        .then(res => res.json());
}

function formatKey(key) {
    return key.toUpperCase().replace(/\s+/g, '');
}

export const { displaySection } = searchSlice.actions;

export default searchSlice.reducer;