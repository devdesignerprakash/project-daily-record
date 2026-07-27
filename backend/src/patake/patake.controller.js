import PatakeService from './patake.service.js';

class PatakeController {
    static async createPatakeData(req, res) {
        try {
            const userId = req.user?.id;
            const data = await PatakeService.createPatakeData({ ...req.body, createdBy: userId });
            res.status(201).json({ message: 'Patake data created successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async updatePatakeData(req, res) {
        try {
            const { id } = req.params;
            const data = await PatakeService.updatePatakeData(id, req.body);
            res.status(200).json({ message: 'Patake data updated successfully', data });
        } catch (error) {
            res.status(error.message === "Patake record not found" ? 404 : 400).json({ message: error.message });
        }
    }

    static async getPatakeDataByDate(req, res) {
        try {
            const { date } = req.query;
            const data = await PatakeService.getPatakeDataByDate(date);
            res.status(200).json({ message: 'Patake data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getPatakeDataByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'startDate and endDate query parameters are required' });
            }
            const data = await PatakeService.getPatakeDataByDateRange(startDate, endDate);
            res.status(200).json({ message: 'Patake data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getPatakeDataByTimeRange(req, res) {
        try {
            const { startTime, endTime } = req.query;
            if (!startTime || !endTime) {
                return res.status(400).json({ message: 'startTime and endTime query parameters are required' });
            }
            const data = await PatakeService.getPatakeDataByTimeRange(startTime, endTime);
            res.status(200).json({ message: 'Patake data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default PatakeController;
