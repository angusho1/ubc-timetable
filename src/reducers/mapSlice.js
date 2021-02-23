import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeMapLocations: [],
    res: null,
    status: 'idle' | 'pending' | 'successful' | 'failed',
    error: null
}

export const openMap = createAsyncThunk('map/openMap',
    async (data) => {
        const building = data.building;
        const address = await fetchAddress(building);
        return fetchLocationData(address);
    }
)

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {

    },
    extraReducers: {
        [openMap.pending]: state => {
            
        },
        [openMap.fulfilled]: (state, action) => {
            state.res = action.payload;
        },
        [openMap.rejected]: state => {
            console.log('Failed');
        }
    }
});

function fetchAddress(building) {
    return fetch('/buildings.json')
        .then(res => {
            const buildingData = res.json();
            return buildingData[building];
        });
}

function fetchLocationData(address) {
    console.log(process.env.NODE_ENV);
    const base = 'https://maps.googleapis.com/maps/api/geocode/json';
    const key = process.env.NODE_ENV.GEOCODING_KEY;
    const url = `${base}?key=${key}&address="${address}"`;
    return fetch(url)
        .then(res => res.json());
}

export default mapSlice.reducer;