import express from 'express';
import PatakeController from './patake.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';
import checkModuleAccess from '../middleware/checkModuleAccess.js';

const patakeRouter = express.Router();

patakeRouter.post('/', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('patake'), PatakeController.createPatakeData);
patakeRouter.put('/:id', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('patake'), PatakeController.updatePatakeData);
patakeRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), PatakeController.getPatakeDataByDate);
patakeRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), PatakeController.getPatakeDataByTimeRange);
patakeRouter.get('/by-date-range', verifyToken, authorizedUser('user', 'admin'), PatakeController.getPatakeDataByDateRange);

export default patakeRouter;
