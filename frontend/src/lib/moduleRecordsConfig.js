// Per-module config for the KPI drill-down (ModuleRecordsModal): where to
// fetch a date-ranged record list from, and which fields to show as columns.
export const MODULE_RECORDS_CONFIG = {
  fitness: {
    label: "सवारी फिटनेस",
    apiPath: "/api/fitness",
    columns: [
      { field: "naya", label: "नयाँ" },
      { field: "nabikaran", label: "नवीकरण" },
      { field: "pratilipi", label: "प्रतिलिपि" },
    ],
  },
  routePermit: {
    label: "अन्तर प्रदेशीय रुट इजाजत",
    apiPath: "/api/route-permit",
    columns: [
      { field: "naya", label: "नयाँ" },
      { field: "nabikaran", label: "नवीकरण" },
      { field: "pratilipi", label: "प्रतिलिपि" },
    ],
  },
  roadworthiness: {
    label: "सडक योग्यता (Road Worthiness)",
    apiPath: "/api/roadworthiness",
    columns: [
      { field: "roadworthiness_test_done", label: "परीक्षण सम्पन्न" },
    ],
  },
  pollution: {
    label: "प्रदुषण जाँचपास",
    apiPath: "/api/pollution",
    columns: [
      { field: "pass", label: "पास" },
      { field: "fail", label: "फेल" },
    ],
  },
  mechanicalTest: {
    label: "यान्त्रिक परीक्षण",
    apiPath: "/api/mechanical-test",
    columns: [
      { field: "count", label: "संख्या" },
    ],
  },
  patake: {
    label: "पटके",
    apiPath: "/api/patake",
    columns: [
      { field: "count", label: "संख्या" },
    ],
  },
  starkayam: {
    label: "स्तर कायम",
    apiPath: "/api/starkayam",
    columns: [
      { field: "naya", label: "नयाँ" },
      { field: "nabikaran", label: "नवीकरण" },
    ],
  },
  monitoring: {
    label: "कारखाना वर्कसप / सवारी परीक्षण केन्द्र अनुगमन",
    apiPath: "/api/monitoring",
    columns: [
      { field: "naya", label: "नयाँ" },
      { field: "nabikaran", label: "नवीकरण" },
    ],
  },
  transportRegistration: {
    label: "यातायात सेवा पञ्जीकरण",
    apiPath: "/api/transport-registration",
    columns: [
      { field: "naya", label: "नयाँ" },
      { field: "thap", label: "थप" },
      { field: "nabikaran", label: "नवीकरण" },
    ],
  },
};
