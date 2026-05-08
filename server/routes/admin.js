const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const User = require("../models/User");
const Community = require("../models/Community");
const Event = require("../models/Event");
const Resource = require("../models/Resource");
const Opportunity = require("../models/Opportunity");

router.get("/stats", auth, adminAuth, async (req, res) => {
    try {
        const users = await User.countDocuments();
        const communities = await Community.countDocuments();
        const events = await Event.countDocuments();
        const resources = await Resource.countDocuments();
        const opportunities = await Opportunity.countDocuments();

        res.json({
            users,
            communities,
            events,
            resources,
            opportunities,
            recent: [
                { type: "Community", title: "Photography Club", date: "Today" },
                { type: "Event", title: "React Workshop", date: "Yesterday" },
            ],
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
});

module.exports = router;