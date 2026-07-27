import express from 'express';
import RoutePermitController from './routePermit.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';
import checkModuleAccess from '../middleware/checkModuleAccess.js';

const routePermitRouter = express.Router();

routePermitRouter.post('/', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('routePermit'), RoutePermitController.createRoutePermitData);
routePermitRouter.put('/:id', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('routePermit'), RoutePermitController.updateRoutePermitData);
routePermitRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), RoutePermitController.getRoutePermitDataByTimeRange);
routePermitRouter.get('/by-date-range', verifyToken, authorizedUser('user', 'admin'), RoutePermitController.getRoutePermitDataByDateRange);
routePermitRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), RoutePermitController.getRoutePermitDataByDate);

export default routePermitRouter;
