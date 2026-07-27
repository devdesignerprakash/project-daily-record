import express from 'express';
import FitnessController from './fitness.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';
import checkModuleAccess from '../middleware/checkModuleAccess.js';

const fitnessRouter = express.Router();

fitnessRouter.post('/', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('fitness'), FitnessController.createFitnessData);
fitnessRouter.put('/:id', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('fitness'), FitnessController.updateFitnessData);
fitnessRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), FitnessController.getFitnessDataByTimeRange);
fitnessRouter.get('/by-date-range', verifyToken, authorizedUser('user', 'admin'), FitnessController.getFitnessDataByDateRange);
fitnessRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), FitnessController.getFitnessDataByDate);

export default fitnessRouter;
