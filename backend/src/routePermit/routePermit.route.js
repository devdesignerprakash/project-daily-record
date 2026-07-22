import express from 'express';
import RoutePermitController from './routePermit.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';

const routePermitRouter = express.Router();

routePermitRouter.post('/', verifyToken, authorizedUser('user', 'admin'), RoutePermitController.createRoutePermitData);
routePermitRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), RoutePermitController.getRoutePermitDataByTimeRange);
routePermitRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), RoutePermitController.getRoutePermitDataByDate);

export default routePermitRouter;
