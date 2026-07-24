import express from 'express';
import NepaliDateController from './nepaliDate.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';

const nepaliDateRouter = express.Router();

nepaliDateRouter.get('/sambat', verifyToken, authorizedUser('user', 'admin'), NepaliDateController.getNepalSambat);

export default nepaliDateRouter;
