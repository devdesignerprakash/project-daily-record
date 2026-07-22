import MechanicalTestService from './mechanicalTest.service.js';

class MechanicalTestController {
    static async createMechanicalTestData(req, res) {
        try {
            const userId = req.user?.id;
            const data = await MechanicalTestService.createMechanicalTestData({ ...req.body, createdBy: userId });
            res.status(201).json({ message: 'Mechanical test data created successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getMechanicalTestDataByDate(req, res) {
        try {
            const { date } = req.query;
            const data = await MechanicalTestService.getMechanicalTestDataByDate(date);
            res.status(200).json({ message: 'Mechanical test data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getMechanicalTestDataByTimeRange(req, res) {
        try {
            const { startTime, endTime } = req.query;
            if (!startTime || !endTime) {
                return res.status(400).json({ message: 'startTime and endTime query parameters are required' });
            }
            const data = await MechanicalTestService.getMechanicalTestDataByTimeRange(startTime, endTime);
            res.status(200).json({ message: 'Mechanical test data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default MechanicalTestController;
