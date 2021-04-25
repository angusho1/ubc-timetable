import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeLocations: [],
    status: 'idle' | 'pending' | 'successful' | 'failed',
    error: null
}

export const loadBuildingLocation = createAsyncThunk('map/loadBuildingLocation',
    async (data) => {
        const building = data.building;
        const address = await fetchAddress(building);
        const geocodingRes = await fetchLocationData(address);
        const location = geocodingRes.results[0].geometry.location;
        const addressComponents = geocodingRes.results[0].address_components;
        return { addressComponents, location, address, building };
    }
)

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        
    },
    extraReducers: {
        [loadBuildingLocation.pending]: state => {
            state.status = 'pending';
        },
        [loadBuildingLocation.fulfilled]: (state, action) => {
            state.status = 'successful';
            const locationData = action.payload;
            if (!state.activeLocations.find(data => data.building === locationData.building)) {
                state.activeLocations.push(action.payload); // TODO: Remove non-active locations
            }
        },
        [loadBuildingLocation.rejected]: (state, action) => {
            state.status = 'failed';
            state.status = action.error.message;
        }
    }
});

function fetchAddress(building) {
    return fetch(`/buildings?name=${building}`)
        .then(res => res.json())
        .then(buildingData => {
            return `${buildingData[0].address}, Vancouver, BC`
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