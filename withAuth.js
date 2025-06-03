const checkAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).send({ message: 'Unauthorized' });
};

const checkAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'ROLE_ADMIN') {
        return next();
    }
    return res.status(403).send({ message: 'Access denied: Admin role required' });
};

const checkAdminOrManager = (req, res, next) => {
    if (req.session && req.session.user && 
        (req.session.user.role === 'ROLE_ADMIN' || req.session.user.role === 'ROLE_MANAGER')) {
        return next();
    }
    return res.status(403).send({ message: 'Access denied: Admin or Manager role required' });
};

const checkManager = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'ROLE_MANAGER') {
        return next();
    }
    return res.status(403).send({ message: 'Access denied: Manager role required' });
};

module.exports = {
    verifyToken: checkAuth,  // keeping the same name for compatibility
    withRoleAdmin: checkAdmin,
    withRoleAdminOrManager: checkAdminOrManager,
    withRoleManager: checkManager
};