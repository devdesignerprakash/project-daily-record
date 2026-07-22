import convertToDate from "../../utils/convertToDate.js";
import Pollution from "./pollution.schema.js";

class PollutionService {
  static async createPollutionData(data) {
    try {
      data.pass = Number(data?.pass);
      data.fail = Number(data?.fail);
      let createData = await Pollution.create(data);
      createData = await createData.populate('createdBy', 'fullName email designation userType');
      return createData;
    } catch (error) {
      console.error("Error creating pollution data:", error);
      throw error;
    }
  }

  static async getPollutionDataByTimeRange(startTime, endTime) {
    try {
      startTime = convertToDate(startTime);
      endTime = convertToDate(endTime);
      const pollutionData = await Pollution.find({
        createdAt: {
          $gte: startTime,
          $lte: endTime,
        },
      }).populate('createdBy', 'fullName email designation userType');
      return pollutionData;
    } catch (error) {
      console.error("Error fetching pollution data by time range:", error);
      throw error;
    }
  }

  static async getPollutionDataByDate(dateString) {
    try {
      const date = dateString ? new Date(dateString) : new Date();
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD or standard format.");
      }
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const pollutionData = await Pollution.find({
        createdAt: {
          $gte: date,
          $lt: nextDay,
        },
      }).populate('createdBy', 'fullName email designation userType');
      return pollutionData;
    } catch (error) {
      console.error("Error fetching pollution data by date:", error);
      throw error;
    }
  }
}

export default PollutionService;
