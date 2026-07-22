import express from 'express';
import RoadworthinessController from './roadworthiness.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';

const roadworthinessRouter = express.Router();

roadworthinessRouter.post('/', verifyToken, authorizedUser('user', 'admin'), RoadworthinessController.createRoadworthinessData);
roadworthinessRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), RoadworthinessController.getRoadworthinessDataByTimeRange);
roadworthinessRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), RoadworthinessController.getRoadworthinessDataByDate);

export default roadworthinessRouter;
