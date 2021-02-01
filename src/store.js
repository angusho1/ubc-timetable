import { configureStore } from '@reduxjs/toolkit';
import timetableReducer from './reducers/timetableSlice';
import searchReducer from './reducers/searchSlice';

export default configureStore({
    reducer: {
        timetable: timetableReducer,
        search: searchReducer
    }
});
