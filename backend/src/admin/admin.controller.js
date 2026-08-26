import AdminService from './admin.service.js';

class AdminController {
    static async getAllModuleRecordsByDate(req, res) {
        try {
            const { date } = req.query;
            const data = await AdminService.getAllModuleRecordsByDate(date);
            res.status(200).json({ message: 'Records fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getAllModuleRecordsByRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'startDate and endDate query parameters are required' });
            }
            const data = await AdminService.getAllModuleRecordsByRange(startDate, endDate);
            res.status(200).json({ message: 'Records fetched successfully', data });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getLastEntryDate(req, res) {
        try {
            const lastDate = await AdminService.getLastEntryDate();
            res.status(200).json({
                message: 'Last entry date fetched successfully',
                date: lastDate ? lastDate.toISOString().slice(0, 10) : null,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getAllDataDates(req, res) {
        try {
            const dates = await AdminService.getAllDataDates();
            res.status(200).json({ message: 'Data dates fetched successfully', dates });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default AdminController;
