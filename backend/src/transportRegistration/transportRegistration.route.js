import express from 'express';
import TransportRegistrationController from './transportRegistration.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';
import checkModuleAccess from '../middleware/checkModuleAccess.js';

const transportRegistrationRouter = express.Router();

transportRegistrationRouter.post('/', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('transportRegistration'), TransportRegistrationController.createTransportRegistrationData);
transportRegistrationRouter.put('/:id', verifyToken, authorizedUser('user', 'admin'), checkModuleAccess('transportRegistration'), TransportRegistrationController.updateTransportRegistrationData);
transportRegistrationRouter.get('/by-date', verifyToken, authorizedUser('user', 'admin'), TransportRegistrationController.getTransportRegistrationDataByDate);
transportRegistrationRouter.get('/by-time-range', verifyToken, authorizedUser('user', 'admin'), TransportRegistrationController.getTransportRegistrationDataByTimeRange);
transportRegistrationRouter.get('/by-date-range', verifyToken, authorizedUser('user', 'admin'), TransportRegistrationController.getTransportRegistrationDataByDateRange);

export default transportRegistrationRouter;
