import express from 'express';
import HealthController from './health.controller.js';

const healthRouter = express.Router();

// Public — no auth. Used by Docker HEALTHCHECK and manual monitoring.
healthRouter.get('/', HealthController.getHealth);

export default healthRouter;
