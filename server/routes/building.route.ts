import express from 'express';
import BuildingController from '../controllers/building.controller';

const router = express.Router();

router.get('/buildings', BuildingController.getBuildings);


export default router;