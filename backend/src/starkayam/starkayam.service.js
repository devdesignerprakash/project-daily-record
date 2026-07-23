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
