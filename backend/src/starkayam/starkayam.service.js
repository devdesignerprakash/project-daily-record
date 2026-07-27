import convertToDate from '../../utils/convertToDate.js';
import Starkayam from './starkayam.schema.js';

class StarkayamService {
    static async createStarkayamData(data) {
        try {
            data.naya = Number(data.naya);
            data.nabikaran = Number(data.nabikaran);
            let created = await Starkayam.create(data);
            created = await created.populate('createdBy', 'fullName email designation userType');
            return created;
        } catch (error) {
            console.error('Error creating starkayam data:', error);
            throw error;
        }
    }

    static async updateStarkayamData(id, data) {
        try {
            if (data?.naya !== undefined) data.naya = Number(data.naya);
            if (data?.nabikaran !== undefined) data.nabikaran = Number(data.nabikaran);
            const updated = await Starkayam.findByIdAndUpdate(id, data, { new: true, runValidators: true })
                .populate('createdBy', 'fullName email designation userType');
            if (!updated) {
                throw new Error("Starkayam record not found");
            }
            return updated;
        } catch (error) {
            console.error('Error updating starkayam data:', error);
            throw error;
        }
    }

    static async getStarkayamDataByDate(dateString) {
        try {
            const date = dateString ? new Date(dateString) : new Date();
            if (isNaN(date.getTime())) throw new Error('Invalid date format.');
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            return await Starkayam.find({
                createdAt: { $gte: date, $lt: nextDay }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching starkayam data by date:', error);
            throw error;
        }
    }

    static async getStarkayamDataByDateRange(startDateString, endDateString) {
        try {
            const startDate = startDateString ? new Date(startDateString) : new Date();
            const endDate = endDateString ? new Date(endDateString) : new Date();
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) throw new Error('Invalid date format.');
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            const endExclusive = new Date(endDate);
            endExclusive.setDate(endExclusive.getDate() + 1);
            return await Starkayam.find({
                createdAt: { $gte: startDate, $lt: endExclusive }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching starkayam data by date range:', error);
            throw error;
        }
    }

    static async getStarkayamDataByTimeRange(startTime, endTime) {
        try {
            startTime = convertToDate(startTime);
            endTime = convertToDate(endTime);
            return await Starkayam.find({
                createdAt: { $gte: startTime, $lte: endTime }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching starkayam data by time range:', error);
            throw error;
        }
    }
}

export default StarkayamService;
