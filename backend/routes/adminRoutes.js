const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const Admin = require("../models/Admin");

const router = express.Router();
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes."
    }
});


router.post(
    "/login",
    loginLimiter,

    [
        body("email")
            .trim()
            .isEmail()
            .withMessage("Please enter a valid email address.")
            .normalizeEmail(),

        body("password")
            .isString()
            .isLength({ min: 8, max: 128 })
            .withMessage("Invalid email or password.")
    ],

    async (req, res) => {
                const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            });
        }
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const admin = await Admin.findOne({
            email: email.trim().toLowerCase()
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // ========================================
        // CREATE JWT
        // ========================================

        const token = jwt.sign(
            {
                adminId: admin._id,
                email: admin.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

     

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 2 * 60 * 60 * 1000,
            path: "/"
        });

        // IMPORTANT:
        // We do NOT send the JWT back to frontend JavaScript.

        return res.status(200).json({
            success: true,
            message: "Admin login successful!"
        });

    } catch (error) {
        console.error("Admin Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during admin login."
        });
    }
});



router.post("/logout", (req, res) => {

    res.clearCookie("adminToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    });

    return res.status(200).json({
        success: true,
        message: "Admin logged out successfully."
    });
});


module.exports = router;