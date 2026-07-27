import express from 'express';
import RoadworthinessController from './roadworthiness.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';
import checkModuleAccess from '../middleware/checkModuleAccess.js';

const roadworthinessRouter = express.Router();

roadworthinessRouter.post('/', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('roadworthiness'), RoadworthinessController.createRoadworthinessData);
roadworthinessRouter.put('/:id', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('roadworthiness'), RoadworthinessController.updateRoadworthinessData);
roadworthinessRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), RoadworthinessController.getRoadworthinessDataByTimeRange);
roadworthinessRouter.get('/by-date-range', verifyToken, authorizedUser('user', 'admin'), RoadworthinessController.getRoadworthinessDataByDateRange);
roadworthinessRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), RoadworthinessController.getRoadworthinessDataByDate);

export default roadworthinessRouter;
