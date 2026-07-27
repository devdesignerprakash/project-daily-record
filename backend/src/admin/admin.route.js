import express from 'express';
import AdminController from './admin.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';

const adminRouter = express.Router();

adminRouter.get('/records-by-date', verifyToken, authorizedUser('admin'), AdminController.getAllModuleRecordsByDate);
adminRouter.get('/records-by-range', verifyToken, authorizedUser('admin'), AdminController.getAllModuleRecordsByRange);

export default adminRouter;
