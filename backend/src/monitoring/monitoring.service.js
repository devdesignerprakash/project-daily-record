import convertToDate from '../../utils/convertToDate.js';
import Monitoring from './monitoring.schema.js';

class MonitoringService {
    static async createMonitoringData(data) {
        try {
            data.naya = Number(data.naya || 0);
            data.nabikaran = Number(data.nabikaran || 0);
            let created = await Monitoring.create(data);
            created = await created.populate('createdBy', 'fullName email designation userType');
            return created;
        } catch (error) {
            console.error('Error creating monitoring data:', error);
            throw error;
        }
    }

    static async getMonitoringDataByDate(dateString) {
        try {
            const date = dateString ? new Date(dateString) : new Date();
            if (isNaN(date.getTime())) throw new Error('Invalid date format.');
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            return await Monitoring.find({
                createdAt: { $gte: date, $lt: nextDay }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching monitoring data by date:', error);
            throw error;
        }
    }

    static async getMonitoringDataByTimeRange(startTime, endTime) {
        try {
            startTime = convertToDate(startTime);
            endTime = convertToDate(endTime);
            return await Monitoring.find({
                createdAt: { $gte: startTime, $lte: endTime }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching monitoring data by time range:', error);
            throw error;
        }
    }
}

export default MonitoringService;
