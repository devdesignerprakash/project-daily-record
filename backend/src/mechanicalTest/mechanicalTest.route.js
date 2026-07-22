import express from 'express';
import MechanicalTestController from './mechanicalTest.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';

const mechanicalTestRouter = express.Router();

mechanicalTestRouter.post('/', verifyToken, authorizedUser('user', 'admin'), MechanicalTestController.createMechanicalTestData);
mechanicalTestRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), MechanicalTestController.getMechanicalTestDataByDate);
mechanicalTestRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), MechanicalTestController.getMechanicalTestDataByTimeRange);

export default mechanicalTestRouter;
