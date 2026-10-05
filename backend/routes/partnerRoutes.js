const express = require("express");
const Partner = require("../models/Partner");
const sendEmail = require("../services/emailService");
const adminAuth = require("../middleware/adminAuth");
const { body, validationResult } = require("express-validator");
const router = express.Router();
router.get("/", adminAuth, async (req, res) => {

    try {

        const partners = await Partner
            .find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            partners: partners
        });

    } catch (error) {

        console.error("Fetch Partner Enquiries Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch partnership enquiries."
        });

    }

});
router.post(
    "/",
    [
        body("fullName")
            .trim()
            .isLength({ min: 2, max: 80 })
            .withMessage("Name must be between 2 and 80 characters.")
            .escape(),

        body("email")
            .trim()
            .isEmail()
            .withMessage("Please enter a valid email address.")
            .normalizeEmail(),

        body("phone")
            .trim()
            .isLength({ min: 7, max: 20 })
            .withMessage("Please enter a valid phone number."),

        body("city")
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage("City must be between 2 and 100 characters.")
            .escape(),

        body("partnershipInterest")
            .trim()
            .isIn([
                "franchise",
                "business",
                "location",
                "investment",
                "collaboration",
                "other"
            ])
            .withMessage("Invalid partnership type."),

        body("message")
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage("Message must be between 10 and 2000 characters.")
            .escape()
    ],
    async (req, res) => {
      const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

    try {

        const {
            fullName,
            email,
            phone,
            city,
            partnershipInterest,
            message
        } = req.body;


        // Save partnership enquiry in MongoDB

        const newPartner = new Partner({
            fullName,
            email,
            phone,
            city,
            partnershipInterest,
            message
        });

        await newPartner.save();


        // Send email notification

        await sendEmail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,

            subject: `New Partnership Enquiry - ${partnershipInterest}`,

            text: `
Burger Emporium - New Partnership Enquiry

Name: ${fullName}
Email: ${email}
Phone: ${phone}
City: ${city}

Partnership Interest:
${partnershipInterest}

Message:
${message}
            `
        });


        res.status(201).json({
            success: true,
            message: "Your partnership request has been submitted successfully!"
        });


    } catch (error) {

        console.error("Partner Error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong while submitting your partnership request."
        });

    }

});

module.exports = router;