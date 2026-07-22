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
    static async getRoutePermitDataByDate(req, res) {
        try {
            const { date } = req.query;
            const routePermitData = await RoutePermitService.getRoutePermitDataByDate(date);
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
