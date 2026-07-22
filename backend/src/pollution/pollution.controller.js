import PollutionService from "./pollution.service.js";

class PollutionController {
  static async createPollutionData(req, res) {
    try {
      const userId = req.user?.id;
      const pollutionData = await PollutionService.createPollutionData({ ...req.body, createdBy: userId });
      res.status(201).json({ message: 'Pollution data created successfully', data: pollutionData });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPollutionDataByDate(req, res) {
    try {
      const { date } = req.query;
      const pollutionData = await PollutionService.getPollutionDataByDate(date);
      res.status(200).json({ message: 'Pollution data fetched successfully', data: pollutionData });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPollutionDataByTimeRange(req, res) {
    try {
      const { startTime, endTime } = req.query;
      if (!startTime || !endTime) {
        return res.status(400).json({ message: 'startTime and endTime query parameters are required' });
      }
      const pollutionData = await PollutionService.getPollutionDataByTimeRange(startTime, endTime);
      res.status(200).json({ message: 'Pollution data fetched successfully', data: pollutionData });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default PollutionController;
