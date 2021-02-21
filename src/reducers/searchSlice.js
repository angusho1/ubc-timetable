import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SearchType } from '../data/SearchType';

const initialState = {
    objectOnDisplay: null,
    typeObjectOnDisplay: null,
    status: 'idle' | 'pending' | 'successful' | 'failed',
    error: null
}

export const searchDept = createAsyncThunk('search/searchDept', 
    async (searchData) => {
        const deptKey = formatKey(searchData.dept);
        return searchDeptByKey(deptKey);
    }
);

export const searchCourse = createAsyncThunk('search/searchCourse', 
    async (searchData) => {
        const deptKey = formatKey(searchData.dept);
        const courseKey = formatKey(searchData.course);
        return searchCourseByKey(deptKey, courseKey);
    }
);

export const searchSection = createAsyncThunk('search/searchSection', 
    async (searchData) => {
        const deptKey = formatKey(searchData.dept);
        const courseKey = formatKey(searchData.course);
        const sectionKey = formatKey(searchData.section);
        return searchSectionByKey(deptKey, courseKey, sectionKey);
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

function searchDeptByKey(deptKey) {
    return fetchData()
        .then(data => {
            const deptSearchResult = data.departments[deptKey];
            if (!deptSearchResult) {
                throw new Error(`'${deptKey}' is not a valid department`);
            }
            return deptSearchResult;
        });
}

function searchCourseByKey(deptKey, courseKey) {
    return  searchDeptByKey(deptKey)
        .then(deptSearchResult => {
            const courseSearchResult = deptSearchResult.courses[courseKey];
            if (!courseSearchResult) {
                throw new Error(`'${deptKey} ${courseKey}' is not a valid course`);
            }
            courseSearchResult['deptObj'] = copyDeptProperties(deptSearchResult);
            return courseSearchResult;
        });
}

function searchSectionByKey(deptKey, courseKey, sectionKey) {
    return searchCourseByKey(deptKey, courseKey)
        .then(courseSearchResult => {
            const sectionSearchResult = courseSearchResult.sections[sectionKey];
            if (!sectionSearchResult) {
                throw new Error(`'${deptKey} ${courseKey} ${sectionKey}' is not a valid section`);
            }
            sectionSearchResult['courseObj'] = copyCourseProperties(courseSearchResult);
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