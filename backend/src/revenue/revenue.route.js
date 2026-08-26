import express from 'express';
import RevenueController from './revenue.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';
import checkModuleAccess from '../middleware/checkModuleAccess.js';

const revenueRouter = express.Router();

revenueRouter.post('/', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('revenue'), RevenueController.createRevenueData);
revenueRouter.put('/:id', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('revenue'), RevenueController.updateRevenueData);
revenueRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), RevenueController.getRevenueDataByDate);
revenueRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), RevenueController.getRevenueDataByTimeRange);
revenueRouter.get('/by-date-range', verifyToken, authorizedUser('user', 'admin'), RevenueController.getRevenueDataByDateRange);

export default revenueRouter;
