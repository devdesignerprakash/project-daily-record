import mongoose from 'mongoose';

const DB_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

class HealthController {
    static async getHealth(req, res) {
        const dbState = mongoose.connection.readyState;
        const dbStatus = DB_STATES[dbState] || 'unknown';
        const healthy = dbState === 1;

        res.status(healthy ? 200 : 503).json({
            status: healthy ? 'ok' : 'degraded',
            uptimeSeconds: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
            db: dbStatus,
        });
    }
}

export default HealthController;
