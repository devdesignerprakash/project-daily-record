import express from 'express';
import TransportRegistrationController from './transportRegistration.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';

const transportRegistrationRouter = express.Router();

transportRegistrationRouter.post('/', verifyToken, authorizedUser('user', 'admin'), TransportRegistrationController.createTransportRegistrationData);
transportRegistrationRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), TransportRegistrationController.getTransportRegistrationDataByDate);
transportRegistrationRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), TransportRegistrationController.getTransportRegistrationDataByTimeRange);

export default transportRegistrationRouter;
