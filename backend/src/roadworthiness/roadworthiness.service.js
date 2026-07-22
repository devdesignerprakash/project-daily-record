import convertToDate from "../../utils/convertToDate.js";
import Roadworthiness from "./roadworthiness.schema.js";

class RoadworthinessService {
  static async createRoadworthinessData(data) {
    try {
      // Handle both roadworthiness_test_done and the custom spelling isroadwrothiss_test_done
      const testDoneValue = data?.roadworthiness_test_done !== undefined 
        ? data.roadworthiness_test_done 
        : data?.isroadwrothiss_test_done;
        
      data.roadworthiness_test_done = Number(testDoneValue);
      
      let createData = await Roadworthiness.create(data);
      createData = await createData.populate('createdBy', 'fullName email designation userType');
      return createData;
    } catch (error) {
      console.error("Error creating roadworthiness data:", error);
      throw error;
    }
  }

  static async getRoadworthinessDataByTimeRange(startTime, endTime) {
    try {
      startTime = convertToDate(startTime);
      endTime = convertToDate(endTime);
      const roadworthinessData = await Roadworthiness.find({
        createdAt: {
          $gte: startTime,
          $lte: endTime,
        },
      }).populate('createdBy', 'fullName email designation userType');
      return roadworthinessData;
    } catch (error) {
      console.error("Error fetching roadworthiness data by time range:", error);
      throw error;
    }
  }

  static async getRoadworthinessDataByDate(dateString) {
    try {
      const date = dateString ? new Date(dateString) : new Date();
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD or standard format.");
      }
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const roadworthinessData = await Roadworthiness.find({
        createdAt: {
          $gte: date,
          $lt: nextDay,
        },
      }).populate('createdBy', 'fullName email designation userType');
      return roadworthinessData;
    } catch (error) {
      console.error("Error fetching roadworthiness data by date:", error);
      throw error;
    }
  }
}

export default RoadworthinessService;
