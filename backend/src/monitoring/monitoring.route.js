import express from 'express';
import MonitoringController from './monitoring.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';

const monitoringRouter = express.Router();

monitoringRouter.post('/', verifyToken, authorizedUser('user', 'admin'), MonitoringController.createMonitoringData);
monitoringRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), MonitoringController.getMonitoringDataByDate);
monitoringRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), MonitoringController.getMonitoringDataByTimeRange);

export default monitoringRouter;
