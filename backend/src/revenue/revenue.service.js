import convertToDate from '../../utils/convertToDate.js';
import logger from '../../utils/logger.js';
import Revenue from './revenue.schema.js';

class RevenueService {
    static async createRevenueData(data) {
        try {
            data.amount = Number(data.amount);
            let created = await Revenue.create(data);
            created = await created.populate('createdBy', 'fullName email designation userType');
            return created;
        } catch (error) {
            logger.error('Error creating revenue data:', error);
            throw error;
        }
    }

    static async updateRevenueData(id, data) {
        try {
            if (data?.amount !== undefined) data.amount = Number(data.amount);
            const updated = await Revenue.findByIdAndUpdate(id, data, { new: true, runValidators: true })
                .populate('createdBy', 'fullName email designation userType');
            if (!updated) {
                throw new Error("Revenue record not found");
            }
            return updated;
        } catch (error) {
            logger.error('Error updating revenue data:', error);
            throw error;
        }
    }

    static async getRevenueDataByDate(dateString) {
        try {
            const date = dateString ? new Date(dateString) : new Date();
            if (isNaN(date.getTime())) throw new Error('Invalid date format.');
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            return await Revenue.find({
                createdAt: { $gte: date, $lt: nextDay }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            logger.error('Error fetching revenue data by date:', error);
            throw error;
        }
    }

    static async getRevenueDataByDateRange(startDateString, endDateString) {
        try {
            const startDate = startDateString ? new Date(startDateString) : new Date();
            const endDate = endDateString ? new Date(endDateString) : new Date();
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) throw new Error('Invalid date format.');
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            const endExclusive = new Date(endDate);
            endExclusive.setDate(endExclusive.getDate() + 1);
            return await Revenue.find({
                createdAt: { $gte: startDate, $lt: endExclusive }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            logger.error('Error fetching revenue data by date range:', error);
            throw error;
        }
    }

    static async getRevenueDataByTimeRange(startTime, endTime) {
        try {
            startTime = convertToDate(startTime);
            endTime = convertToDate(endTime);
            return await Revenue.find({
                createdAt: { $gte: startTime, $lte: endTime }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            logger.error('Error fetching revenue data by time range:', error);
            throw error;
        }
    }
}

export default RevenueService;
