import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import buildingService from '../services/buildingService';
import BuildingService from '../services/buildingService';

const initialState = {
    activeLocations: [],
    status: 'idle' | 'pending' | 'successful' | 'failed',
    error: null,
    currentBuilding: null
}

export const loadBuildingLocation = createAsyncThunk('map/loadBuildingLocation',
    async (data) => {
        const building = data.building;
        const address = (await buildingService.getBuildingByName(building)).address;
        const geocodingRes = await BuildingService.getLocationDataByAddress(address);
        const location = geocodingRes.results[0].geometry.location;
        const addressComponents = geocodingRes.results[0].address_components;
        return { addressComponents, location, address, building };
    }
);

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        changeCurrentBuilding: (state, action) => {
            state.currentBuilding = action.payload.building;
        }
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

export const { changeCurrentBuilding } = mapSlice.actions;

export default mapSlice.reducer;