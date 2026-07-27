import convertToDate from '../../utils/convertToDate.js';
import MechanicalTest from './mechanicalTest.schema.js';

class MechanicalTestService {
    static async createMechanicalTestData(data) {
        try {
            data.count = Number(data.count);
            let created = await MechanicalTest.create(data);
            created = await created.populate('createdBy', 'fullName email designation userType');
            return created;
        } catch (error) {
            console.error('Error creating mechanical test data:', error);
            throw error;
        }
    }

    static async updateMechanicalTestData(id, data) {
        try {
            if (data?.count !== undefined) data.count = Number(data.count);
            const updated = await MechanicalTest.findByIdAndUpdate(id, data, { new: true, runValidators: true })
                .populate('createdBy', 'fullName email designation userType');
            if (!updated) {
                throw new Error("Mechanical test record not found");
            }
            return updated;
        } catch (error) {
            console.error('Error updating mechanical test data:', error);
            throw error;
        }
    }

    static async getMechanicalTestDataByDate(dateString) {
        try {
            const date = dateString ? new Date(dateString) : new Date();
            if (isNaN(date.getTime())) throw new Error('Invalid date format.');
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            return await MechanicalTest.find({
                createdAt: { $gte: date, $lt: nextDay }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching mechanical test data by date:', error);
            throw error;
        }
    }

    static async getMechanicalTestDataByDateRange(startDateString, endDateString) {
        try {
            const startDate = startDateString ? new Date(startDateString) : new Date();
            const endDate = endDateString ? new Date(endDateString) : new Date();
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) throw new Error('Invalid date format.');
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            const endExclusive = new Date(endDate);
            endExclusive.setDate(endExclusive.getDate() + 1);
            return await MechanicalTest.find({
                createdAt: { $gte: startDate, $lt: endExclusive }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching mechanical test data by date range:', error);
            throw error;
        }
    }

    static async getMechanicalTestDataByTimeRange(startTime, endTime) {
        try {
            startTime = convertToDate(startTime);
            endTime = convertToDate(endTime);
            return await MechanicalTest.find({
                createdAt: { $gte: startTime, $lte: endTime }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching mechanical test data by time range:', error);
            throw error;
        }
    }
}

export default MechanicalTestService;
