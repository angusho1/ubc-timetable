import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SearchType } from '../data/SearchType';

const initialState = {
    objectOnDisplay: null,
    typeObjectOnDisplay: null,
    currentCourseKey: null,
    currentSectionKey: null,
    status: null,
    error: null
}

export const searchDept = createAsyncThunk('search/searchDept', 
    async (searchData) => {
        const dept = searchData.dept;
        const data = await fetchData();
        const deptKey = formatKey(dept);
        const deptSearchResult = data.departments[deptKey];
        if (!deptSearchResult) {
            throw new Error(`${deptKey} is not a valid department`);
        }
        return deptSearchResult;
    }
);

export const searchCourse = createAsyncThunk('search/searchCourse', 
    async (searchData) => {
        const dept = searchData.dept;
        const course = searchData.course;
        const data = await fetchData();
        const deptKey = formatKey(dept);
        const courseKey = formatKey(course);

        const deptSearchResult = data.departments[deptKey];
        if (!deptSearchResult) {
            throw new Error(`${deptKey} is not a valid department`);
        }

        const courseSearchResult = deptSearchResult.courses[courseKey];
        if (!courseSearchResult) {
            throw new Error(`${deptKey} ${courseKey} is not a valid course`);
        }

        return courseSearchResult;
    }
);

export const searchSection = createAsyncThunk('search/searchSection', 
    async (searchData) => {
        const dept = searchData.dept;
        const course = searchData.course;
        const section = searchData.section;
        const data = await fetchData();
        const deptKey = formatKey(dept);
        const courseKey = formatKey(course);
        const sectionKey = formatKey(section);

        const deptSearchResult = data.departments[deptKey];
        if (!deptSearchResult) {
            throw new Error(`${dept} is not a valid department`);
        }

        const courseSearchResult = deptSearchResult.courses[courseKey];
        if (!courseSearchResult) {
            throw new Error(`${dept} ${course} is not a valid course`);
        }

        const sectionSearchResult = courseSearchResult.sections[sectionKey];
        if (!sectionSearchResult) {
            throw new Error(`${dept} ${course} ${section} is not a valid section`);
        }

        return sectionSearchResult;
    }
);

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {

    },
    extraReducers: {
        [searchDept.pending]: (state, action) => {
            state.status = 'pending';
            state.typeObjectOnDisplay = SearchType.DEPT;
        },
        [searchDept.fulfilled]: (state, action) => {
            console.log(action.payload);
            state.status = 'completed';
            state.objectOnDisplay = action.payload;
        },
        [searchDept.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },

        [searchCourse.pending]: (state, action) => {
            state.status = 'pending';
            state.typeObjectOnDisplay = SearchType.COURSE;
        },
        [searchCourse.fulfilled]: (state, action) => {
            console.log(action.payload);
            state.status = 'completed';
            state.objectOnDisplay = action.payload.response;
            state.currentCourseKey = action.payload.course;
        },
        [searchCourse.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },

        [searchSection.pending]: (state, action) => {
            state.status = 'pending';
            state.typeObjectOnDisplay = SearchType.SECTION;
        },
        [searchSection.fulfilled]: (state, action) => {
            console.log(action.payload);
            state.status = 'completed';
            state.objectOnDisplay = action.payload.response;
            state.currentCourseKey = action.payload.course;
            state.currentSectionKey = action.payload.section;
        },
        [searchSection.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    }
});


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