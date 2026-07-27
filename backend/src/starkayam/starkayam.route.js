import express from 'express';
import StarkayamController from './starkayam.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';
import checkModuleAccess from '../middleware/checkModuleAccess.js';

const starkayamRouter = express.Router();

starkayamRouter.post('/', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('starkayam'), StarkayamController.createStarkayamData);
starkayamRouter.put('/:id', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('starkayam'), StarkayamController.updateStarkayamData);
starkayamRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), StarkayamController.getStarkayamDataByDate);
starkayamRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), StarkayamController.getStarkayamDataByTimeRange);
starkayamRouter.get('/by-date-range', verifyToken, authorizedUser('user', 'admin'), StarkayamController.getStarkayamDataByDateRange);

export default starkayamRouter;
