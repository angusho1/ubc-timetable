import * as BuildingService from '../services/building.service';

async function getBuildings(req, res, next) {
    const result = await BuildingService.getBuildings();
    res.json({ res: result.toString() })
}

export default { getBuildings }