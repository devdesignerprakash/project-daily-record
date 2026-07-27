import express from 'express';
import MonitoringController from './monitoring.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';
import checkModuleAccess from '../middleware/checkModuleAccess.js';

const monitoringRouter = express.Router();

monitoringRouter.post('/', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('monitoring'), MonitoringController.createMonitoringData);
monitoringRouter.put('/:id', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('monitoring'), MonitoringController.updateMonitoringData);
monitoringRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), MonitoringController.getMonitoringDataByDate);
monitoringRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), MonitoringController.getMonitoringDataByTimeRange);
monitoringRouter.get('/by-date-range', verifyToken, authorizedUser('user', 'admin'), MonitoringController.getMonitoringDataByDateRange);

export default monitoringRouter;
