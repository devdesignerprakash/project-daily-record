import FitnessService from '../fitness/fitness.service.js';
import RoutePermitService from '../routePermit/routePermit.service.js';
import RoadworthinessService from '../roadworthiness/roadworthiness.service.js';
import PollutionService from '../pollution/pollution.service.js';
import MechanicalTestService from '../mechanicalTest/mechanicalTest.service.js';
import PatakeService from '../patake/patake.service.js';
import StarkayamService from '../starkayam/starkayam.service.js';
import MonitoringService from '../monitoring/monitoring.service.js';
import TransportRegistrationService from '../transportRegistration/transportRegistration.service.js';

import Fitness from '../fitness/fitness.schema.js';
import RoutePermit from '../routePermit/routePermit.schema.js';
import Roadworthiness from '../roadworthiness/roadworthiness.schema.js';
import Pollution from '../pollution/pollution.schema.js';
import MechanicalTest from '../mechanicalTest/mechanicalTest.schema.js';
import Patake from '../patake/patake.schema.js';
import Starkayam from '../starkayam/starkayam.schema.js';
import Monitoring from '../monitoring/monitoring.schema.js';
import TransportRegistration from '../transportRegistration/transportRegistration.schema.js';

const ALL_MODELS = [
    Fitness, RoutePermit, Roadworthiness, Pollution, MechanicalTest,
    Patake, Starkayam, Monitoring, TransportRegistration,
];

class AdminService {
    static async getAllModuleRecordsByDate(dateString) {
        const [
            fitness,
            routePermit,
            roadworthiness,
            pollution,
            mechanicalTest,
            patake,
            starkayam,
            monitoring,
            transportRegistration,
        ] = await Promise.all([
            FitnessService.getFitnessDataByDate(dateString),
            RoutePermitService.getRoutePermitDataByDate(dateString),
            RoadworthinessService.getRoadworthinessDataByDate(dateString),
            PollutionService.getPollutionDataByDate(dateString),
            MechanicalTestService.getMechanicalTestDataByDate(dateString),
            PatakeService.getPatakeDataByDate(dateString),
            StarkayamService.getStarkayamDataByDate(dateString),
            MonitoringService.getMonitoringDataByDate(dateString),
            TransportRegistrationService.getTransportRegistrationDataByDate(dateString),
        ]);

        return {
            fitness,
            routePermit,
            roadworthiness,
            pollution,
            mechanicalTest,
            patake,
            starkayam,
            monitoring,
            transportRegistration,
        };
    }

    static async getAllModuleRecordsByRange(startDate, endDate) {
        const [
            fitness,
            routePermit,
            roadworthiness,
            pollution,
            mechanicalTest,
            patake,
            starkayam,
            monitoring,
            transportRegistration,
        ] = await Promise.all([
            FitnessService.getFitnessDataByDateRange(startDate, endDate),
            RoutePermitService.getRoutePermitDataByDateRange(startDate, endDate),
            RoadworthinessService.getRoadworthinessDataByDateRange(startDate, endDate),
            PollutionService.getPollutionDataByDateRange(startDate, endDate),
            MechanicalTestService.getMechanicalTestDataByDateRange(startDate, endDate),
            PatakeService.getPatakeDataByDateRange(startDate, endDate),
            StarkayamService.getStarkayamDataByDateRange(startDate, endDate),
            MonitoringService.getMonitoringDataByDateRange(startDate, endDate),
            TransportRegistrationService.getTransportRegistrationDataByDateRange(startDate, endDate),
        ]);

        return {
            fitness,
            routePermit,
            roadworthiness,
            pollution,
            mechanicalTest,
            patake,
            starkayam,
            monitoring,
            transportRegistration,
        };
    }

    // Most recent calendar date (across all modules) that has any data
    // entered before today — i.e. "yesterday" in the sense of the last
    // day someone actually recorded something, not necessarily the
    // literal previous calendar day (accounts for weekends/holidays with
    // no entries at all).
    static async getLastEntryDate() {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const latestDocs = await Promise.all(
            ALL_MODELS.map((Model) =>
                Model.findOne({ createdAt: { $lt: startOfToday } })
                    .sort({ createdAt: -1 })
                    .select('createdAt')
                    .lean()
            )
        );

        const timestamps = latestDocs.filter(Boolean).map((doc) => doc.createdAt.getTime());
        if (timestamps.length === 0) {
            return null;
        }

        return new Date(Math.max(...timestamps));
    }

    // Every calendar date (across all modules) that has at least one record,
    // before today — used to find dates with real data that are missing from
    // the manually-maintained Progress Records Excel (the "All Data" sheet
    // never gets duplicate Year/Month/Day rows, so only dates with actual
    // data are candidates here).
    static async getAllDataDates() {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const perModelDates = await Promise.all(
            ALL_MODELS.map((Model) =>
                Model.aggregate([
                    { $match: { createdAt: { $lt: startOfToday } } },
                    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } } },
                ])
            )
        );

        const dateSet = new Set();
        perModelDates.forEach((docs) => docs.forEach((doc) => dateSet.add(doc._id)));

        return Array.from(dateSet).sort();
    }
}

export default AdminService;
