import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ScraperType } from '../data/ScraperType';
import { SearchType } from '../data/SearchType';
import CourseDataService from '../services/courseDataService';

const services = {
    [ScraperType.NATIVE]: new CourseDataService(ScraperType.NATIVE),
    [ScraperType.UBCCOURSESAPI]: new CourseDataService(ScraperType.UBCCOURSESAPI),
}

const initialState = {
    objectOnDisplay: null,
    typeObjectOnDisplay: SearchType.SUBJECTS,
    currentSession: {
        year: 2021,     // TODO: Change hardcode
        season: 'W'
    },
    status: 'idle' | 'pending' | 'successful' | 'failed',
    error: null
}

export const getDeptList = createAsyncThunk('search/getDeptList',
    async (searchData) => {
        const { scraperType, ...payload } = searchData;
        const courseDataService = services[scraperType];
        const res = await courseDataService.getAllSubjects(payload);
        return res;
    }
);

export const searchDept = createAsyncThunk('search/searchDept', 
    async (searchData) => {
        const { scraperType, ...payload } = searchData;
        const courseDataService = services[scraperType];
        const res = await courseDataService.searchDept(payload);
        return res;
    }
);

export const searchCourse = createAsyncThunk('search/searchCourse', 
    async (searchData) => {
        const { scraperType, ...payload } = searchData;
        const courseDataService = services[scraperType];
        const res = await courseDataService.searchCourse(payload);
        return res;
    }
);

export const searchSection = createAsyncThunk('search/searchSection', 
    async (searchData) => {
        const { scraperType, ...payload } = searchData;
        const courseDataService = services[scraperType];
        const res = await courseDataService.searchSection(payload);
        return res;
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
        [getDeptList.pending]: state => {
            setPendingSearch(state, SearchType.SUBJECTS);
        },
        [getDeptList.fulfilled]: (state, action) => {
            setSuccessfulSearch(state, action);
        },
        [getDeptList.rejected]: setFailedSearch,

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

export const { displaySection } = searchSlice.actions;

export default searchSlice.reducer;