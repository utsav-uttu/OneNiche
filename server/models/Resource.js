const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["pdf", "handbook", "youtube", "link"],
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
