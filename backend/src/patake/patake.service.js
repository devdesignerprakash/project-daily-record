import convertToDate from '../../utils/convertToDate.js';
import Patake from './patake.schema.js';

class PatakeService {
    static async createPatakeData(data) {
        try {
            data.count = Number(data.count);
            let created = await Patake.create(data);
            created = await created.populate('createdBy', 'fullName email designation userType');
            return created;
        } catch (error) {
            console.error('Error creating patake data:', error);
            throw error;
        }
    }

    static async getPatakeDataByDate(dateString) {
        try {
            const date = dateString ? new Date(dateString) : new Date();
            if (isNaN(date.getTime())) throw new Error('Invalid date format.');
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            return await Patake.find({
                createdAt: { $gte: date, $lt: nextDay }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching patake data by date:', error);
            throw error;
        }
    }

    static async getPatakeDataByTimeRange(startTime, endTime) {
        try {
            startTime = convertToDate(startTime);
            endTime = convertToDate(endTime);
            return await Patake.find({
                createdAt: { $gte: startTime, $lte: endTime }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching patake data by time range:', error);
            throw error;
        }
    }
}

export default PatakeService;
