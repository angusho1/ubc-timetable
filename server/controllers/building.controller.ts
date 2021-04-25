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
    const result = await BuildingService.getLocationData(req.query);
    res.json(result);
}

export default { getBuilding, getBuildings, getLocationData }