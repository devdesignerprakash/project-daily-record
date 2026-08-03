import MonitoringService from './monitoring.service.js';
import applyBackdate from '../../utils/applyBackdate.js';

class MonitoringController {
    static async createMonitoringData(req, res) {
        try {
            const userId = req.user?.id;
            const payload = applyBackdate(req, { ...req.body, createdBy: userId });
            const data = await MonitoringService.createMonitoringData(payload);
            res.status(201).json({ message: 'Monitoring data created successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async updateMonitoringData(req, res) {
        try {
            const { id } = req.params;
            const data = await MonitoringService.updateMonitoringData(id, req.body);
            res.status(200).json({ message: 'Monitoring data updated successfully', data });
        } catch (error) {
            res.status(error.message === "Monitoring record not found" ? 404 : 400).json({ message: error.message });
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

    static async getMonitoringDataByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'startDate and endDate query parameters are required' });
            }
            const data = await MonitoringService.getMonitoringDataByDateRange(startDate, endDate);
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
