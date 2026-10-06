const nodemailer = require("nodemailer");
const dns = require("node:dns").promises;

const sendEmail = async ({ to, subject, html }) => {
    try {
        // Resolve Gmail to an IPv4 address only
        const addresses = await dns.resolve4("smtp.gmail.com");

        if (!addresses || addresses.length === 0) {
            throw new Error("Could not resolve smtp.gmail.com to IPv4");
        }

        const smtpIPv4 = addresses[0];

        console.log("Gmail SMTP IPv4:", smtpIPv4);

        const transporter = nodemailer.createTransport({
            host: smtpIPv4,
            port: 587,
            secure: false,

            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },

            requireTLS: true,

            tls: {
                servername: "smtp.gmail.com"
            },

            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000
        });

        await transporter.sendMail({
            from: `"Burger Emporium" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        console.log("Email sent successfully");

        return true;

    } catch (error) {
        console.error("Email sending failed:", error.message);

        return false;
    }
};

module.exports = sendEmail;