import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    addedSections: [],
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
})

export default searchSlice.reducer;