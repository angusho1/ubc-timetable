import express from 'express';
import BuildingController from '../controllers/building.controller';

const router = express.Router();

router.get('/building', BuildingController.getBuilding);
router.get('/buildings', BuildingController.getBuildings);
router.get('/location', BuildingController.getLocationData);


export default router;