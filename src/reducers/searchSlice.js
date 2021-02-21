import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SearchType } from '../data/SearchType';

const initialState = {
    objectOnDisplay: null,
    typeObjectOnDisplay: null,
    currentCourseKey: null,
    currentSectionKey: null,
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
            state.currentCourseKey = action.payload.course;
        },
        [searchCourse.rejected]: setFailedSearch,

        [searchSection.pending]: state => {
            setPendingSearch(state, SearchType.SECTION);
        },
        [searchSection.fulfilled]: (state, action) => {
            setSuccessfulSearch(state, action);
            state.currentCourseKey = action.payload.course;
            state.currentSectionKey = action.payload.section;
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
}

function searchDeptByKey(deptKey) {
    return fetchData()
        .then(data => {
            const deptSearchResult = data.departments[deptKey];
            if (!deptSearchResult) {
                throw new Error(`${deptKey} is not a valid department`);
            }
            return deptSearchResult;
        });
}

function searchCourseByKey(deptKey, courseKey) {
    return  searchDeptByKey(deptKey)
        .then(deptSearchResult => {
            const courseSearchResult = deptSearchResult.courses[courseKey];
            if (!courseSearchResult) {
                throw new Error(`${deptKey} ${courseKey} is not a valid course`);
            }
            courseSearchResult['dept'] = copyDeptProperties({}, deptSearchResult);
            return courseSearchResult;
        });
}

function searchSectionByKey(deptKey, courseKey, sectionKey) {
    return searchCourseByKey(deptKey, courseKey)
        .then(courseSearchResult => {
            const sectionSearchResult = courseSearchResult.sections[sectionKey];
            if (!sectionSearchResult) {
                throw new Error(`${deptKey} ${courseKey} ${sectionKey} is not a valid section`);
            }
            return sectionSearchResult;
        });
}

function copyDeptProperties(courseObj, deptObj) {
    for (let prop in deptObj) {
        if (Object.prototype.hasOwnProperty.call(deptObj, prop) && prop !== 'courses') {
            courseObj[prop] = deptObj[prop];
        }
    }
    return courseObj;
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

// export const { searchDept, searchCourse, searchSection } = searchSlice.actions;

export default searchSlice.reducer;