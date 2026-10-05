const express = require("express");
const Feedback = require("../models/Feedback");
const sendEmail = require("../services/emailService");
const { body, validationResult } = require("express-validator");
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();

router.get("/", adminAuth, async (req, res) => {

    try {

        const feedback = await Feedback
            .find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            feedback: feedback
        });

    } catch (error) {

        console.error("Fetch Feedback Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch feedback."
        });

    }

});

router.post(
    "/",
    [
        body("name")
            .trim()
            .isLength({ min: 2, max: 80 })
            .withMessage("Name must be between 2 and 80 characters.")
            .escape(),

        body("email")
            .trim()
            .isEmail()
            .withMessage("Please enter a valid email address.")
            .normalizeEmail(),

        body("rating")
            .isInt({ min: 1, max: 5 })
            .withMessage("Rating must be between 1 and 5."),

        body("food")
            .isInt({ min: 1, max: 5 })
            .withMessage("Food rating must be between 1 and 5."),

        body("service")
            .isInt({ min: 1, max: 5 })
            .withMessage("Service rating must be between 1 and 5."),

        body("ambience")
            .isInt({ min: 1, max: 5 })
            .withMessage("Ambience rating must be between 1 and 5."),

        body("value")
            .isInt({ min: 1, max: 5 })
            .withMessage("Value rating must be between 1 and 5."),

        body("message")
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage("Feedback must be between 10 and 2000 characters.")
            .escape(),

        body("recommendation")
            .isIn(["yes", "maybe", "no"])
            .withMessage("Invalid recommendation value.")
    ],
    async (req, res) =>  {
     const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }
    try {

        const {
            name,
            email,
            rating,
            food,
            service,
            ambience,
            value,
            message,
            recommendation
        } = req.body;


        // Save feedback in MongoDB

        const newFeedback = new Feedback({
            name,
            email,
            rating,
            food,
            service,
            ambience,
            value,
            message,
            recommendation
        });

        await newFeedback.save();


        // Send email notification

        await sendEmail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,

            subject: `New Customer Feedback - ${rating}/5`,

            text: `
Burger Emporium - New Customer Feedback

Name: ${name}
Email: ${email}

Overall Rating: ${rating}/5
Food: ${food}/5
Service: ${service}/5
Ambience: ${ambience}/5
Value for Money: ${value}/5

Recommendation: ${recommendation}

Feedback:
${message}
            `
        });


        res.status(201).json({
            success: true,
            message: "Your feedback has been submitted successfully!"
        });


    } catch (error) {

        console.error("Feedback Error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong while submitting your feedback."
        });

    }

});

module.exports = router;