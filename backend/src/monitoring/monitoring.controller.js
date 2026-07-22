import MonitoringService from './monitoring.service.js';

class MonitoringController {
    static async createMonitoringData(req, res) {
        try {
            const userId = req.user?.id;
            const data = await MonitoringService.createMonitoringData({ ...req.body, createdBy: userId });
            res.status(201).json({ message: 'Monitoring data created successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getMonitoringDataByDate(req, res) {
        try {
            const { date } = req.query;
            const data = await MonitoringService.getMonitoringDataByDate(date);
            res.status(200).json({ message: 'Monitoring data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getMonitoringDataByTimeRange(req, res) {
        try {
            const { startTime, endTime } = req.query;
            if (!startTime || !endTime) {
                return res.status(400).json({ message: 'startTime and endTime query parameters are required' });
            }
            const data = await MonitoringService.getMonitoringDataByTimeRange(startTime, endTime);
            res.status(200).json({ message: 'Monitoring data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default MonitoringController;
