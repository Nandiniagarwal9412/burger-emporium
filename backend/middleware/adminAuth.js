const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
    try {
        // Get JWT from HTTP-only cookie
        const token = req.cookies.adminToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Admin login required."
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded admin information
        req.admin = decoded;

        next();

    } catch (error) {
        console.error("Admin Auth Error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin session."
        });
    }
};

module.exports = adminAuth;