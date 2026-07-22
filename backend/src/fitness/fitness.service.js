import convertToDate from "../../utils/convertToDate.js";
import Fitness from "./fitness.schema.js";

class FitnessService {
  static async createFitnessData(data) {
    try {
      data.nabikaran = Number(data?.nabikaran);
      data.naya = Number(data?.naya);
      if (data?.pratilipi !== undefined && data?.pratilipi !== null) {
        data.pratilipi = Number(data?.pratilipi);
      }
      let createData = await Fitness.create(data);
      createData = await createData.populate('createdBy', 'fullName email designation userType');
      return createData;
    } catch (error) {
      console.error("Error creating fitness data:", error);
      throw error;
    }
  }

  static async getFitnessDataByTimeRange(startTime, endTime) {
    try {
      startTime = convertToDate(startTime);
      endTime = convertToDate(endTime);
      const fitnessData = await Fitness.find({
        createdAt: {
          $gte: startTime,
          $lte: endTime,
        },
      }).populate('createdBy', 'fullName email designation userType');
      return fitnessData;
    } catch (error) {
      console.error("Error fetching fitness data by time range:", error);
      throw error;
    }
  }

  static async getFitnessDataByDate(dateString) {
    try {
      const date = dateString ? new Date(dateString) : new Date();
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD or standard format.");
      }
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const fitnessData = await Fitness.find({
        createdAt: {
          $gte: date,
          $lt: nextDay,
        },
      }).populate('createdBy', 'fullName email designation userType');
      return fitnessData;
    } catch (error) {
      console.error("Error fetching fitness data by date:", error);
      throw error;
    }
  }
}

export default FitnessService;
