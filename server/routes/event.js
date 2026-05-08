const express = require("express");
const Event = require("../models/Event");
const Community = require("../models/Community");
const User = require("../models/User");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

/* GET ALL EVENTS */
router.get("/", async (req, res) => {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
});

/* GET SORTED EVENTS BY USER INTERESTS */
router.get("/sorted/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const interests = user.interests.map(i => i.toLowerCase());
        const allEvents = await Event.find().sort({ date: 1 }).populate('community');

        // Separate events into matching and non-matching
        const matchingEvents = [];
        const otherEvents = [];

        for (const event of allEvents) {
            let matchesInterest = false;

            // Check if event has a community and if it matches user interests
            if (event.community) {
                const communityName = event.community.name.toLowerCase();
                const communityDesc = event.community.description.toLowerCase();

                matchesInterest = interests.some(interest =>
                    communityName.includes(interest) || communityDesc.includes(interest)
                );
            }

            // Also check event title and description
            if (!matchesInterest) {
                const eventTitle = event.title.toLowerCase();
                const eventDesc = event.description.toLowerCase();

                matchesInterest = interests.some(interest =>
                    eventTitle.includes(interest) || eventDesc.includes(interest)
                );
            }

            const eventObj = event.toObject();
            eventObj.matchesInterest = matchesInterest;

            if (matchesInterest) {
                matchingEvents.push(eventObj);
            } else {
                otherEvents.push(eventObj);
            }
        }

        // Return matching events first, then others
        res.json([...matchingEvents, ...otherEvents]);
    } catch (error) {
        console.error("Sorted events error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/* CREATE EVENT (ADMIN) */
router.post("/", auth, adminAuth, async (req, res) => {
    const event = new Event({
        ...req.body,
        createdBy: req.user._id,
    });

    await event.save();
    res.status(201).json(event);
});

/* RSVP EVENT */
router.post("/:id/rsvp", auth, async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event.attendees.includes(req.user._id)) {
        event.attendees.push(req.user._id);
        await event.save();
    }

    res.json({ message: "RSVP successful" });
});

/* UN-RSVP EVENT */
router.post("/:id/leave", auth, async (req, res) => {
    try {
        await Event.findByIdAndUpdate(req.params.id, {
            $pull: { attendees: req.user._id },
        });
        res.json({ message: "Un-RSVP successful" });
    } catch {
        res.status(400).json({ message: "Failed to leave event" });
    }
});

/* DELETE EVENT */
router.delete("/:id", auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can delete events" });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete event" });
    }
});

module.exports = router;
