import RoutePermitService from "./routePermit.service.js";

class RoutePermitController{
     static async createRoutePermitData(req, res) {
        try {
            const userId = req.user?.id;
            const routePermitData = await RoutePermitService.createRoutePermitData({ ...req.body, createdBy: userId });
            res.status(201).json({ message: 'Route permit data created successfully', data: routePermitData });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async updateRoutePermitData(req, res) {
        try {
            const { id } = req.params;
            const routePermitData = await RoutePermitService.updateRoutePermitData(id, req.body);
            res.status(200).json({ message: 'Route permit data updated successfully', data: routePermitData });
        } catch (error) {
            res.status(error.message === "Route permit record not found" ? 404 : 400).json({ message: error.message });
        }
    }
    static async getRoutePermitDataByDate(req, res) {
        try {
            const { date } = req.query;
            const routePermitData = await RoutePermitService.getRoutePermitDataByDate(date);
            res.status(200).json({ message: 'Route permit data fetched successfully', data: routePermitData });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async getRoutePermitDataByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'startDate and endDate query parameters are required' });
            }
            const routePermitData = await RoutePermitService.getRoutePermitDataByDateRange(startDate, endDate);
            res.status(200).json({ message: 'Route permit data fetched successfully', data: routePermitData });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async getRoutePermitDataByTimeRange(req, res) {
        try {
            const { startTime, endTime } = req.query;
            if (!startTime || !endTime) {
                return res.status(400).json({ message: 'startTime and endTime query parameters are required' });
            }
            const routePermitData = await RoutePermitService.getRoutePermitDataByTimeRange(startTime, endTime);
            res.status(200).json({ message: 'Route permit data fetched successfully', data: routePermitData });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
export default RoutePermitController;
