const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["internship", "gig", "job"],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        skills: [String],
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        applicants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);
