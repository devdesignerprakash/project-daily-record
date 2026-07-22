import express from 'express';
import PatakeController from './patake.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';

const patakeRouter = express.Router();

patakeRouter.post('/', verifyToken, authorizedUser('user', 'admin'), PatakeController.createPatakeData);
patakeRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), PatakeController.getPatakeDataByDate);
patakeRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), PatakeController.getPatakeDataByTimeRange);

export default patakeRouter;
