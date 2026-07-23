import FitnessService from '../fitness/fitness.service.js';
import RoutePermitService from '../routePermit/routePermit.service.js';
import RoadworthinessService from '../roadworthiness/roadworthiness.service.js';
import PollutionService from '../pollution/pollution.service.js';
import MechanicalTestService from '../mechanicalTest/mechanicalTest.service.js';
import PatakeService from '../patake/patake.service.js';
import StarkayamService from '../starkayam/starkayam.service.js';
import MonitoringService from '../monitoring/monitoring.service.js';
import TransportRegistrationService from '../transportRegistration/transportRegistration.service.js';

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
}

export default AdminService;
