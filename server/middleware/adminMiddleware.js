const adminMiddleware = (req, res, next) => {

    // authMiddleware 会把当前用户信息放到 req.user
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    // check role
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "You do not have permission to perform this action"
        });
    }

    // is admin
    next();
};

module.exports = adminMiddleware;