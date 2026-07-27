import express from 'express';
import MechanicalTestController from './mechanicalTest.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';
import checkModuleAccess from '../middleware/checkModuleAccess.js';

const mechanicalTestRouter = express.Router();

mechanicalTestRouter.post('/', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('mechanicalTest'), MechanicalTestController.createMechanicalTestData);
mechanicalTestRouter.put('/:id', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('mechanicalTest'), MechanicalTestController.updateMechanicalTestData);
mechanicalTestRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), MechanicalTestController.getMechanicalTestDataByDate);
mechanicalTestRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), MechanicalTestController.getMechanicalTestDataByTimeRange);
mechanicalTestRouter.get('/by-date-range', verifyToken, authorizedUser('user', 'admin'), MechanicalTestController.getMechanicalTestDataByDateRange);

export default mechanicalTestRouter;
