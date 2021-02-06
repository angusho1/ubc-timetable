import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    objectOnDisplay: null,
    typeObjectOnDisplay: null,
    currentCourseKey: null,
    currentSectionKey: null
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        searchDept: (state, action) => {

        },
        searchCourse: (state, action) => {

        },
        searchSection: (state, action) => {

        }
    }
});

export const { searchDept, searchCourse, searchSection } = searchSlice.actions;

export default searchSlice.reducer;