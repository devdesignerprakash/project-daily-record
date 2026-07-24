import NepaliDateService from './nepaliDate.service.js';

class NepaliDateController {
    static async getNepalSambat(req, res) {
        // वि.सं. मिति स्थानीय रूपमै गणना गरिने भएकाले नेपाल संवत ल्याउन नसके पनि सधैँ पठाउने
        const miti = NepaliDateService.getBikramSambatMiti();
        try {
            const neSambat = await NepaliDateService.fetchNepalSambat();
            res.status(200).json({ message: 'मिति ल्याइयो', neSambat, miti });
        } catch (error) {
            res.status(200).json({ message: error.message, neSambat: null, miti });
        }
    }
}

export default NepaliDateController;
