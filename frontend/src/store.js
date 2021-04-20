import { configureStore } from '@reduxjs/toolkit';
import timetableReducer from './reducers/timetableSlice';
import searchReducer from './reducers/searchSlice';
import mapReducer from './reducers/mapSlice';

export default configureStore({
    reducer: {
        timetable: timetableReducer,
        search: searchReducer,
        map: mapReducer
    }
});
