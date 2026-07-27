// Admins always have full access. 'user' accounts are gated by the
// allowedModules list embedded in their JWT at login (see auth.controller.js) —
// same staleness model as the existing role check: takes effect on next login.
const checkModuleAccess = (moduleKey) => (req, res, next) => {
    if (req.user?.role === 'admin') {
        return next();
    }
    const allowed = req.user?.allowedModules;
    if (Array.isArray(allowed) && allowed.includes(moduleKey)) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. You do not have permission for this module.' });
};

export default checkModuleAccess;
