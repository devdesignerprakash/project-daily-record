import FitnessService from "./fitness.service.js";

class FitnessController{
     static async createFitnessData(req, res) {
        try {
            const userId = req.user?.id;
            const fitnessData = await FitnessService.createFitnessData({ ...req.body, createdBy: userId });
            res.status(201).json({ message: 'Fitness data created successfully', data: fitnessData });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async updateFitnessData(req, res) {
        try {
            const { id } = req.params;
            const fitnessData = await FitnessService.updateFitnessData(id, req.body);
            res.status(200).json({ message: 'Fitness data updated successfully', data: fitnessData });
        } catch (error) {
            res.status(error.message === "Fitness record not found" ? 404 : 400).json({ message: error.message });
        }
    }
    static async getFitnessDataByDate(req, res) {
        try {
            const { date } = req.query;
            const fitnessData = await FitnessService.getFitnessDataByDate(date);
            res.status(200).json({ message: 'Fitness data fetched successfully', data: fitnessData });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async getFitnessDataByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'startDate and endDate query parameters are required' });
            }
            const fitnessData = await FitnessService.getFitnessDataByDateRange(startDate, endDate);
            res.status(200).json({ message: 'Fitness data fetched successfully', data: fitnessData });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async getFitnessDataByTimeRange(req, res) {
        try {
            const { startTime, endTime } = req.query;
            if (!startTime || !endTime) {
                return res.status(400).json({ message: 'startTime and endTime query parameters are required' });
            }
            const fitnessData = await FitnessService.getFitnessDataByTimeRange(startTime, endTime);
            res.status(200).json({ message: 'Fitness data fetched successfully', data: fitnessData });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
export default FitnessController;