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

    static async updatePatakeData(id, data) {
        try {
            if (data?.count !== undefined) data.count = Number(data.count);
            const updated = await Patake.findByIdAndUpdate(id, data, { new: true, runValidators: true })
                .populate('createdBy', 'fullName email designation userType');
            if (!updated) {
                throw new Error("Patake record not found");
            }
            return updated;
        } catch (error) {
            console.error('Error updating patake data:', error);
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

    static async getPatakeDataByDateRange(startDateString, endDateString) {
        try {
            const startDate = startDateString ? new Date(startDateString) : new Date();
            const endDate = endDateString ? new Date(endDateString) : new Date();
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) throw new Error('Invalid date format.');
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            const endExclusive = new Date(endDate);
            endExclusive.setDate(endExclusive.getDate() + 1);
            return await Patake.find({
                createdAt: { $gte: startDate, $lt: endExclusive }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching patake data by date range:', error);
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
