import RevenueService from './revenue.service.js';
import applyBackdate from '../../utils/applyBackdate.js';

class RevenueController {
    static async createRevenueData(req, res) {
        try {
            const userId = req.user?.id;
            const payload = applyBackdate(req, { ...req.body, createdBy: userId });
            const data = await RevenueService.createRevenueData(payload);
            res.status(201).json({ message: 'Revenue data created successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async updateRevenueData(req, res) {
        try {
            const { id } = req.params;
            const data = await RevenueService.updateRevenueData(id, req.body);
            res.status(200).json({ message: 'Revenue data updated successfully', data });
        } catch (error) {
            res.status(error.message === "Revenue record not found" ? 404 : 400).json({ message: error.message });
        }
    }

    static async getRevenueDataByDate(req, res) {
        try {
            const { date } = req.query;
            const data = await RevenueService.getRevenueDataByDate(date);
            res.status(200).json({ message: 'Revenue data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getRevenueDataByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'startDate and endDate query parameters are required' });
            }
            const data = await RevenueService.getRevenueDataByDateRange(startDate, endDate);
            res.status(200).json({ message: 'Revenue data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getRevenueDataByTimeRange(req, res) {
        try {
            const { startTime, endTime } = req.query;
            if (!startTime || !endTime) {
                return res.status(400).json({ message: 'startTime and endTime query parameters are required' });
            }
            const data = await RevenueService.getRevenueDataByTimeRange(startTime, endTime);
            res.status(200).json({ message: 'Revenue data fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default RevenueController;
