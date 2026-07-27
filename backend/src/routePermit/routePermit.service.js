import convertToDate from "../../utils/convertToDate.js";
import RoutePermit from "./routePermit.schema.js";

class RoutePermitService {
  static async createRoutePermitData(data) {
    try {
      data.nabikaran = Number(data?.nabikaran);
      data.naya = Number(data?.naya);
      if (data?.pratilipi !== undefined && data?.pratilipi !== null) {
        data.pratilipi = Number(data?.pratilipi);
      }
      let createData = await RoutePermit.create(data);
      createData = await createData.populate('createdBy', 'fullName email designation userType');
      return createData;
    } catch (error) {
      console.error("Error creating routePermit data:", error);
      throw error;
    }
  }

  static async updateRoutePermitData(id, data) {
    try {
      if (data?.nabikaran !== undefined) data.nabikaran = Number(data.nabikaran);
      if (data?.naya !== undefined) data.naya = Number(data.naya);
      if (data?.pratilipi !== undefined && data?.pratilipi !== null) {
        data.pratilipi = Number(data.pratilipi);
      }
      const updated = await RoutePermit.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate('createdBy', 'fullName email designation userType');
      if (!updated) {
        throw new Error("Route permit record not found");
      }
      return updated;
    } catch (error) {
      console.error("Error updating routePermit data:", error);
      throw error;
    }
  }

  static async getRoutePermitDataByDateRange(startDateString, endDateString) {
    try {
      const startDate = startDateString ? new Date(startDateString) : new Date();
      const endDate = endDateString ? new Date(endDateString) : new Date();
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD.");
      }
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const endExclusive = new Date(endDate);
      endExclusive.setDate(endExclusive.getDate() + 1);

      return await RoutePermit.find({
        createdAt: { $gte: startDate, $lt: endExclusive },
      }).populate('createdBy', 'fullName email designation userType');
    } catch (error) {
      console.error("Error fetching routePermit data by date range:", error);
      throw error;
    }
  }

  static async getRoutePermitDataByTimeRange(startTime, endTime) {
    try {
      startTime = convertToDate(startTime);
      endTime = convertToDate(endTime);
      const routePermitData = await RoutePermit.find({
        createdAt: {
          $gte: startTime,
          $lte: endTime,
        },
      }).populate('createdBy', 'fullName email designation userType');
      return routePermitData;
    } catch (error) {
      console.error("Error fetching routePermit data by time range:", error);
      throw error;
    }
  }

  static async getRoutePermitDataByDate(dateString) {
    try {
      const date = dateString ? new Date(dateString) : new Date();
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD or standard format.");
      }
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const routePermitData = await RoutePermit.find({
        createdAt: {
          $gte: date,
          $lt: nextDay,
        },
      }).populate('createdBy', 'fullName email designation userType');
      return routePermitData;
    } catch (error) {
      console.error("Error fetching routePermit data by date:", error);
      throw error;
    }
  }
}

export default RoutePermitService;
