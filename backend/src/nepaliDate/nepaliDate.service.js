import NepaliDatePkg from "nepali-date-converter";

const NepaliDate = NepaliDatePkg.default || NepaliDatePkg;

// vftc.gov.np (this office) is tried first; if it's unreachable (its TLS
// certificate has been observed expired) or its markup changes, these other
// government sites run the exact same shared CMS widget (giwmscdnone.gov.np
// template) and reliably carry the identical नेपाल संवत text, so they make
// safe fallbacks — no certificate checks are ever relaxed, a source that
// fails (including on TLS errors) is simply skipped in favour of the next.
const SOURCE_URLS = [
    "https://www.vftc.gov.np/",   // सवारी परीक्षण कार्यालय टेकु (this office)
    "https://dotm.gov.np/",       // यातायात व्यवस्था विभाग (parent department)
    "https://mopit.gov.np/",      // भौतिक पूर्वाधार तथा यातायात मन्त्रालय
];

// Matches: नेपाल संवत: <span> <b> ११४६ दिल्लाथ्व दशमी - १० </b> </span>
const SAMBAT_REGEX = /नेपाल\s*संवत\s*:\s*<span>\s*<b>\s*([^<]+?)\s*<\/b>/;

// These sites only update this once a day — cache per calendar day so the
// letter modal isn't waiting on an external site on every open/click.
let cache = { date: null, value: null };

const getNepalNow = () => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" }));

const todayKey = () => getNepalNow().toISOString().slice(0, 10);

const fetchSambatFrom = async (url) => {
    const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
        throw new Error(`status ${response.status}`);
    }

    const html = await response.text();
    const match = html.match(SAMBAT_REGEX);

    if (!match) {
        throw new Error("पाठ फेला परेन");
    }

    return match[1].trim();
};

const fetchNepalSambat = async () => {
    const today = todayKey();
    if (cache.date === today && cache.value) {
        return cache.value;
    }

    const failures = [];
    for (const url of SOURCE_URLS) {
        try {
            const value = await fetchSambatFrom(url);
            cache = { date: today, value };
            return value;
        } catch (error) {
            failures.push(`${url} (${error.message})`);
        }
    }

    throw new Error(`नेपाल संवत मिति कुनै पनि स्रोतबाट ल्याउन सकिएन: ${failures.join(", ")}`);
};

// The वि.सं. (Bikram Sambat) widget on vftc.gov.np is filled in by client-side
// JS (AD→BS conversion), not present in the server-rendered HTML, so it can't
// be scraped. We compute the same value ourselves instead.
const getBikramSambatMiti = () => {
    const nd = new NepaliDate(getNepalNow());
    return nd.format("YYYY/MM/DD", "np");
};

export default { fetchNepalSambat, getBikramSambatMiti };
