const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        partnershipInterest: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        }
    },

    {
        timestamps: true
    }
);

const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;