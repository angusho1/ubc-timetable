import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    deptValue: '',
    deptValid: false,
    deptSearched: false,
    courseValue: '',
    courseValid: false,
    courseSearched: false,
    sectionValue: '',
    sectionValid: false,
    sectionSearched: false
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