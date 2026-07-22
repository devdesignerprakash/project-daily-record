import RoadworthinessService from "./roadworthiness.service.js";

class RoadworthinessController{
     static async createRoadworthinessData(req, res) {
        try {
            const userId = req.user?.id;
            const roadworthinessData = await RoadworthinessService.createRoadworthinessData({ ...req.body, createdBy: userId });
            res.status(201).json({ message: 'Roadworthiness data created successfully', data: roadworthinessData });
        } catch (error) {
            res.status(400).json({ message: error.message });
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
