const express = require("express");
const Contact = require("../models/Contact");
const sendEmail = require("../services/emailService");
const adminAuth = require("../middleware/adminAuth");
const { body, validationResult } = require("express-validator");
const router = express.Router();
router.get("/", adminAuth, async (req, res) => {

    try {

        const contacts = await Contact
            .find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            contacts: contacts
        });

    } catch (error) {

        console.error("Fetch Contacts Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch contact messages."
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

        body("phone")
            .optional({ values: "falsy" })
            .trim()
            .isLength({ max: 20 })
            .withMessage("Invalid phone number."),

        body("subject")
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage("Subject must be between 2 and 100 characters.")
            .escape(),

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

        // Your existing contact POST code continues here

    try {

        const {
            name,
            email,
            phone,
            subject,
            message
        } = req.body;


        // Save contact message in MongoDB

        const newContact = new Contact({
            name,
            email,
            phone,
            subject,
            message
        });

        await newContact.save();


        // Send email notification

        await sendEmail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,

            subject: `New Contact Message - ${subject}`,

            text: `
Burger Emporium - New Contact Message

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}
            `
        });


        res.status(201).json({
            success: true,
            message: "Your message has been submitted successfully!"
        });


    } catch (error) {

        console.error("Contact Error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong while submitting your message."
        });

    }

});

module.exports = router;