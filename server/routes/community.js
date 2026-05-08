const express = require("express");
const Community = require("../models/Community");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post("/", auth, adminAuth, async (req, res) => {
    try {
        const { name, description } = req.body;

        const community = new Community({
            name,
            description,
            createdBy: req.user._id,
        });

        await community.save();
        res.status(201).json(community);
    } catch (err) {
        res.status(500).json({ message: "Failed to create community" });
    }
});

router.get("/", async (req, res) => {
    const communities = await Community.find();
    res.json(communities);
});

// GET communities sorted by user interests
router.get("/sorted/:userId", async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.params.userId);

        if (!user) {
            // If no user found, return all communities unsorted
            const communities = await Community.find();
            return res.json(communities);
        }

        const interests = user.interests.map(i => i.toLowerCase());
        const allCommunities = await Community.find();

        // Separate communities into interest matches and non-matches
        const communitiesWithFlags = allCommunities.map(c => {
            const matchesInterest = interests.some(i =>
                c.name.toLowerCase().includes(i) ||
                c.description.toLowerCase().includes(i)
            );

            return {
                ...c.toObject(),
                matchesInterest
            };
        });

        // Sort: interest matches first, then by member count
        const sortedCommunities = communitiesWithFlags.sort((a, b) => {
            // First priority: interest match
            if (a.matchesInterest && !b.matchesInterest) return -1;
            if (!a.matchesInterest && b.matchesInterest) return 1;

            // Second priority: member count
            const countA = (a.members?.length || 0) + (a.guestMemberCount || 0);
            const countB = (b.members?.length || 0) + (b.guestMemberCount || 0);
            return countB - countA;
        });

        res.json(sortedCommunities);
    } catch (err) {
        console.error("Error sorting communities:", err);
        res.status(500).json({ message: "Failed to fetch communities" });
    }
});

/* JOIN COMMUNITY */
/* JOIN COMMUNITY */
router.post("/:id/join", async (req, res) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            try {
                const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
                await Community.findByIdAndUpdate(req.params.id, {
                    $addToSet: { members: decoded.id },
                });
                return res.json({ message: "Joined successfully" });
            } catch (e) {
                // Invalid token, treat as guest or error? Let's treat as guest if token is bad implies intended to be user but failed. 
                // However, simple approach: if verify fails, they are not a user.
                // But typically we should verify properly.
                // Re-reading 'auth' middleware usage: it attaches req.user.
                // If I remove 'auth' middleware, I need to verify manually.
            }
        }

        // Guest Logic
        await Community.findByIdAndUpdate(req.params.id, {
            $inc: { guestMemberCount: 1 }
        });
        res.json({ message: "Joined as guest" });
    } catch {
        res.status(400).json({ message: "Join failed" });
    }
});

/* LEAVE COMMUNITY */
/* LEAVE COMMUNITY */
router.post("/:id/leave", async (req, res) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            try {
                const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
                await Community.findByIdAndUpdate(req.params.id, {
                    $pull: { members: decoded.id },
                });
                return res.json({ message: "Left successfully" });
            } catch (e) {
                // Invalid token
            }
        }

        // Guest Logic
        await Community.findByIdAndUpdate(req.params.id, {
            $inc: { guestMemberCount: -1 }
        });
        res.json({ message: "Left as guest" });
    } catch {
        res.status(400).json({ message: "Leave failed" });
    }
});

/* DELETE COMMUNITY */
router.delete("/:id", auth, async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can delete communities" });
        }

        await Community.findByIdAndDelete(req.params.id);
        res.json({ message: "Community deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete community" });
    }
});

module.exports = router;