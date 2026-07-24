import NepaliDatePkg from "nepali-date-converter";

const NepaliDate = NepaliDatePkg.default || NepaliDatePkg;

const SOURCE_URL = "https://www.vftc.gov.np/";

// Matches: नेपाल संवत: <span> <b> ११४६ दिल्लाथ्व दशमी - १० </b> </span>
const SAMBAT_REGEX = /नेपाल\s*संवत\s*:\s*<span>\s*<b>\s*([^<]+?)\s*<\/b>/;

// vftc.gov.np only updates this once a day — cache per calendar day so the
// letter modal isn't waiting on an external site on every open/click.
let cache = { date: null, value: null };

const getNepalNow = () => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" }));

const todayKey = () => getNepalNow().toISOString().slice(0, 10);

const fetchNepalSambat = async () => {
    const today = todayKey();
    if (cache.date === today && cache.value) {
        return cache.value;
    }

    const response = await fetch(SOURCE_URL, {
        headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
        throw new Error(`vftc.gov.np बाट मिति ल्याउन सकिएन (status ${response.status})`);
    }

    const html = await response.text();
    const match = html.match(SAMBAT_REGEX);

    if (!match) {
        throw new Error("नेपाल संवत मिति फेला परेन");
    }

    const value = match[1].trim();
    cache = { date: today, value };
    return value;
};

// The वि.सं. (Bikram Sambat) widget on vftc.gov.np is filled in by client-side
// JS (AD→BS conversion), not present in the server-rendered HTML, so it can't
// be scraped. We compute the same value ourselves instead.
const getBikramSambatMiti = () => {
    const nd = new NepaliDate(getNepalNow());
    return nd.format("YYYY/MM/DD", "np");
};

export default { fetchNepalSambat, getBikramSambatMiti };
