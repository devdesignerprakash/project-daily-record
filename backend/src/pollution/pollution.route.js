import express from 'express';
import PollutionController from './pollution.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';
import checkModuleAccess from '../middleware/checkModuleAccess.js';

const pollutionRouter = express.Router();

pollutionRouter.post('/', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('pollution'), PollutionController.createPollutionData);
pollutionRouter.put('/:id', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('pollution'), PollutionController.updatePollutionData);
pollutionRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), PollutionController.getPollutionDataByTimeRange);
pollutionRouter.get('/by-date-range', verifyToken, authorizedUser('user', 'admin'), PollutionController.getPollutionDataByDateRange);
pollutionRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), PollutionController.getPollutionDataByDate);

export default pollutionRouter;
