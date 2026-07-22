import express from 'express';
import FitnessController from './fitness.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';

const fitnessRouter = express.Router();

fitnessRouter.post('/', verifyToken, authorizedUser('user', 'admin'), FitnessController.createFitnessData);
fitnessRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), FitnessController.getFitnessDataByTimeRange);
fitnessRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), FitnessController.getFitnessDataByDate);

export default fitnessRouter;
