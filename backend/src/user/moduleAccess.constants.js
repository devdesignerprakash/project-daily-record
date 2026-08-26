// Data-entry modules a 'user' account can be granted create/update access to.
// Keys match each module's Express mount path segment (camelCase / kebab handled per-route).
export const MODULE_KEYS = [
    'fitness',
    'routePermit',
    'roadworthiness',
    'pollution',
    'mechanicalTest',
    'patake',
    'starkayam',
    'monitoring',
    'transportRegistration',
    'revenue',
];
