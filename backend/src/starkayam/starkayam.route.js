import express from 'express';
import StarkayamController from './starkayam.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';

const starkayamRouter = express.Router();

starkayamRouter.post('/', verifyToken, authorizedUser('user', 'admin'), StarkayamController.createStarkayamData);
starkayamRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), StarkayamController.getStarkayamDataByDate);
starkayamRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), StarkayamController.getStarkayamDataByTimeRange);

export default starkayamRouter;
