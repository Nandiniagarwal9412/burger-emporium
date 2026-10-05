const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        food: {
            type: Number,
            min: 1,
            max: 5
        },

        service: {
            type: Number,
            min: 1,
            max: 5
        },

        ambience: {
            type: Number,
            min: 1,
            max: 5
        },

        value: {
            type: Number,
            min: 1,
            max: 5
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        recommendation: {
            type: String,
            enum: ["yes", "maybe", "no"],
            required: true
        }
    },

    {
        timestamps: true
    }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;