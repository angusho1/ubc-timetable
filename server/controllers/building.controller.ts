import * as BuildingService from '../services/building.service';

async function getBuildings(req, res, next) {
    console.log(req.query);
    const result = await BuildingService.getBuildings(req.query);
    res.json(result);
}

export default { getBuildings }