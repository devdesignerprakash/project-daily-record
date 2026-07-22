import TransportRegistrationService from './transportRegistration.service.js';

class TransportRegistrationController {
    static async createTransportRegistrationData(req, res) {
        try {
            const userId = req.user?.id;
            const data = await TransportRegistrationService.createTransportRegistrationData({ ...req.body, createdBy: userId });
            res.status(201).json({ message: 'Transport registration data created successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
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
