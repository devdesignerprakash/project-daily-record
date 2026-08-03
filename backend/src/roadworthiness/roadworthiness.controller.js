import RoadworthinessService from "./roadworthiness.service.js";
import applyBackdate from "../../utils/applyBackdate.js";

class RoadworthinessController{
     static async createRoadworthinessData(req, res) {
        try {
            const userId = req.user?.id;
            const data = applyBackdate(req, { ...req.body, createdBy: userId });
            const roadworthinessData = await RoadworthinessService.createRoadworthinessData(data);
            res.status(201).json({ message: 'Roadworthiness data created successfully', data: roadworthinessData });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async updateRoadworthinessData(req, res) {
        try {
            const { id } = req.params;
            const roadworthinessData = await RoadworthinessService.updateRoadworthinessData(id, req.body);
            res.status(200).json({ message: 'Roadworthiness data updated successfully', data: roadworthinessData });
        } catch (error) {
            res.status(error.message === "Roadworthiness record not found" ? 404 : 400).json({ message: error.message });
        }
    }
    static async getRoadworthinessDataByDate(req, res) {
        try {
            const { date } = req.query;
            const roadworthinessData = await RoadworthinessService.getRoadworthinessDataByDate(date);
            res.status(200).json({ message: 'Roadworthiness data fetched successfully', data: roadworthinessData });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async getRoadworthinessDataByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'startDate and endDate query parameters are required' });
            }
            const roadworthinessData = await RoadworthinessService.getRoadworthinessDataByDateRange(startDate, endDate);
            res.status(200).json({ message: 'Roadworthiness data fetched successfully', data: roadworthinessData });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async getRoadworthinessDataByTimeRange(req, res) {
        try {
            const { startTime, endTime } = req.query;
            if (!startTime || !endTime) {
                return res.status(400).json({ message: 'startTime and endTime query parameters are required' });
            }
            const roadworthinessData = await RoadworthinessService.getRoadworthinessDataByTimeRange(startTime, endTime);
            res.status(200).json({ message: 'Roadworthiness data fetched successfully', data: roadworthinessData });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
export default RoadworthinessController;
