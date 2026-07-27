// Data-entry modules a 'user' account can be granted access to.
// Keys must match backend/src/user/moduleAccess.constants.js and each
// module tab's `value` in app/page.js.
export const MODULE_OPTIONS = [
  { key: "fitness", label: "सवारी फिटनेस" },
  { key: "routePermit", label: "अन्तर प्रदेशीय रुट इजाजत" },
  { key: "roadworthiness", label: "सडक योग्यता" },
  { key: "pollution", label: "प्रदुषण परीक्षण" },
  { key: "mechanicalTest", label: "यान्त्रिक परीक्षण" },
  { key: "patake", label: "पटके" },
  { key: "starkayam", label: "स्तर कायम" },
  { key: "monitoring", label: "कारखाना अनुगमन" },
  { key: "transportRegistration", label: "यातायात पञ्जीकरण" },
];

export const MODULE_KEYS = MODULE_OPTIONS.map((m) => m.key);
