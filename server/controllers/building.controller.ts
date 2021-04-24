import * as BuildingService from '../services/building.service';

async function getBuildings(req, res, next) {
    const result = await BuildingService.getBuildings();
    console.log(result);
    res.json(result);
}

export default { getBuildings }