import * as BuildingService from '../services/building.service';

async function getBuilding(req, res, next) {
    console.log(req.query);
    const result = await BuildingService.getBuilding(req.query);
    res.json(result);
}

async function getBuildings(req, res, next) {
    console.log(req.query);
    const result = await BuildingService.getBuildings(req.query);
    res.json(result);
}

async function getLocationData(req, res, next) {
    let result;
    if (req.query.address) {
        result = await BuildingService.getLocationDataByAddress(req.query.address);
    } else {
        result = await BuildingService.getLocationData(req.query);
    }
    res.json(result);
}

export default { getBuilding, getBuildings, getLocationData }