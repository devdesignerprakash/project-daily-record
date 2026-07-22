import StarkayamService from './starkayam.service.js';

class StarkayamController {
    static async createStarkayamData(req, res) {
        try {
            const userId = req.user?.id;
            const data = await StarkayamService.createStarkayamData({ ...req.body, createdBy: userId });
            res.status(201).json({ message: 'Starkayam data created successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getStarkayamDataByDate(req, res) {
        try {
            const { date } = req.query;
            const data = await StarkayamService.getStarkayamDataByDate(date);
            res.status(200).json({ message: 'Starkayam data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getStarkayamDataByTimeRange(req, res) {
        try {
            const { startTime, endTime } = req.query;
            if (!startTime || !endTime) {
                return res.status(400).json({ message: 'startTime and endTime query parameters are required' });
            }
            const data = await StarkayamService.getStarkayamDataByTimeRange(startTime, endTime);
            res.status(200).json({ message: 'Starkayam data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default StarkayamController;
