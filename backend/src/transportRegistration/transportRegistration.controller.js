import TransportRegistrationService from './transportRegistration.service.js';
import applyBackdate from '../../utils/applyBackdate.js';

class TransportRegistrationController {
    static async createTransportRegistrationData(req, res) {
        try {
            const userId = req.user?.id;
            const payload = applyBackdate(req, { ...req.body, createdBy: userId });
            const data = await TransportRegistrationService.createTransportRegistrationData(payload);
            res.status(201).json({ message: 'Transport registration data created successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async updateTransportRegistrationData(req, res) {
        try {
            const { id } = req.params;
            const data = await TransportRegistrationService.updateTransportRegistrationData(id, req.body);
            res.status(200).json({ message: 'Transport registration data updated successfully', data });
        } catch (error) {
            res.status(error.message === "Transport registration record not found" ? 404 : 400).json({ message: error.message });
        }
    }

    static async getTransportRegistrationDataByDate(req, res) {
        try {
            const { date } = req.query;
            const data = await TransportRegistrationService.getTransportRegistrationDataByDate(date);
            res.status(200).json({ message: 'Transport registration data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getTransportRegistrationDataByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'startDate and endDate query parameters are required' });
            }
            const data = await TransportRegistrationService.getTransportRegistrationDataByDateRange(startDate, endDate);
            res.status(200).json({ message: 'Transport registration data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getTransportRegistrationDataByTimeRange(req, res) {
        try {
            const { startTime, endTime } = req.query;
            if (!startTime || !endTime) {
                return res.status(400).json({ message: 'startTime and endTime query parameters are required' });
            }
            const data = await TransportRegistrationService.getTransportRegistrationDataByTimeRange(startTime, endTime);
            res.status(200).json({ message: 'Transport registration data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default TransportRegistrationController;
