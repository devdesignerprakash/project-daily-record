import convertToDate from '../../utils/convertToDate.js';
import TransportRegistration from './transportRegistration.schema.js';

class TransportRegistrationService {
    static async createTransportRegistrationData(data) {
        try {
            data.naya = Number(data.naya || 0);
            data.nabikaran = Number(data.nabikaran || 0);
            data.thap = Number(data.thap || 0);
            let created = await TransportRegistration.create(data);
            created = await created.populate('createdBy', 'fullName email designation userType');
            return created;
        } catch (error) {
            console.error('Error creating transport registration data:', error);
            throw error;
        }
    }

    static async updateTransportRegistrationData(id, data) {
        try {
            if (data?.naya !== undefined) data.naya = Number(data.naya);
            if (data?.nabikaran !== undefined) data.nabikaran = Number(data.nabikaran);
            if (data?.thap !== undefined) data.thap = Number(data.thap);
            const updated = await TransportRegistration.findByIdAndUpdate(id, data, { new: true, runValidators: true })
                .populate('createdBy', 'fullName email designation userType');
            if (!updated) {
                throw new Error("Transport registration record not found");
            }
            return updated;
        } catch (error) {
            console.error('Error updating transport registration data:', error);
            throw error;
        }
    }

    static async getTransportRegistrationDataByDate(dateString) {
        try {
            const date = dateString ? new Date(dateString) : new Date();
            if (isNaN(date.getTime())) throw new Error('Invalid date format.');
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            return await TransportRegistration.find({
                createdAt: { $gte: date, $lt: nextDay }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching transport registration data by date:', error);
            throw error;
        }
    }

    static async getTransportRegistrationDataByDateRange(startDateString, endDateString) {
        try {
            const startDate = startDateString ? new Date(startDateString) : new Date();
            const endDate = endDateString ? new Date(endDateString) : new Date();
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) throw new Error('Invalid date format.');
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            const endExclusive = new Date(endDate);
            endExclusive.setDate(endExclusive.getDate() + 1);
            return await TransportRegistration.find({
                createdAt: { $gte: startDate, $lt: endExclusive }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching transport registration data by date range:', error);
            throw error;
        }
    }

    static async getTransportRegistrationDataByTimeRange(startTime, endTime) {
        try {
            startTime = convertToDate(startTime);
            endTime = convertToDate(endTime);
            return await TransportRegistration.find({
                createdAt: { $gte: startTime, $lte: endTime }
            }).populate('createdBy', 'fullName email designation userType');
        } catch (error) {
            console.error('Error fetching transport registration data by time range:', error);
            throw error;
        }
    }
}

export default TransportRegistrationService;
