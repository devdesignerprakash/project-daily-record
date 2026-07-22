import express from 'express';
import PollutionController from './pollution.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';

const pollutionRouter = express.Router();

pollutionRouter.post('/', verifyToken, authorizedUser('user', 'admin'), PollutionController.createPollutionData);
pollutionRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), PollutionController.getPollutionDataByTimeRange);
pollutionRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), PollutionController.getPollutionDataByDate);

export default pollutionRouter;
