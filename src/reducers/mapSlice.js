import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeMapLocations: [],
    addressComponents: null,
    coords: null,
    building: null,
    address: null,
    res: null,
    status: 'idle' | 'pending' | 'successful' | 'failed',
    error: null
}

export const openMap = createAsyncThunk('map/openMap',
    async (data) => {
        const building = data.building;
        const address = await fetchAddress(building);
        const geocodingRes = await fetchLocationData(address);
        const location = geocodingRes.results[0].geometry.location;
        const addressComponents = geocodingRes.results[0].address_components;
        return {
            addressComponents, location, address, building
        };
    }
)

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {

    },
    extraReducers: {
        [openMap.pending]: state => {
            state.status = 'pending';
        },
        [openMap.fulfilled]: (state, action) => {
            state.status = 'successful';
            state.addressComponents = action.payload.addressComponents;
            state.coords = action.payload.location;
            state.building = action.payload.building;
            state.address = action.payload.address;
        },
        [openMap.rejected]: (state, action) => {
            state.status = 'failed';
            state.status = action.error.message;
        }
    }
});

function fetchAddress(building) {
    return fetch('/buildings.json')
        .then(res => res.json())
        .then(buildingData => {
            console.log(buildingData);
            return `${buildingData[building].address}, Vancouver, BC`;
        });
}

function fetchLocationData(address) {
    const base = 'https://maps.googleapis.com/maps/api/geocode/json';
    const key = process.env.REACT_APP_GEOCODING_KEY;
    const url = `${base}?key=${key}&address="${address}"`;
    return fetch(url)
        .then(res => res.json());
}

export default mapSlice.reducer;