const express = require("express");
const User = require("../models/User");
const Community = require("../models/Community");
const Event = require("../models/Event");
const Opportunity = require("../models/Opportunity");

const router = express.Router();

// GET recommendations for user
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const interests = user.interests.map(i => i.toLowerCase());

        // --- Community recommendations ---
        const allCommunities = await Community.find();

        // 1. Find direct interest matches
        let recommendedCommunities = allCommunities.filter(c =>
            interests.some(i =>
                c.name.toLowerCase().includes(i) ||
                c.description.toLowerCase().includes(i)
            )
        ).map(c => ({
            ...c.toObject(),
            matchesInterest: true
        }));

        // 2. Fallback to popular communities if we don't have enough recommendations (min 6)
        if (recommendedCommunities.length < 6) {
            const popularCommunities = allCommunities
                .sort((a, b) => {
                    const countA = (a.members?.length || 0) + (a.guestMemberCount || 0);
                    const countB = (b.members?.length || 0) + (b.guestMemberCount || 0);
                    return countB - countA;
                })
                .filter(c => !recommendedCommunities.find(rc => rc._id.toString() === c._id.toString()))
                .map(c => ({
                    ...c.toObject(),
                    matchesInterest: false
                }));

            recommendedCommunities = [...recommendedCommunities, ...popularCommunities].slice(0, 10);
        } else {
            recommendedCommunities = recommendedCommunities.slice(0, 10);
        }

        // --- Event recommendations ---
        const events = await Event.find();
        const recommendedEvents = events.filter(e =>
            e.community && recommendedCommunities.some(
                c => c._id.toString() === e.community.toString()
            )
        );

        // --- Opportunity recommendations ---
        const opportunities = await Opportunity.find();
        const recommendedOpportunities = opportunities.filter(o =>
            o.skills.some(skill =>
                interests.includes(skill.toLowerCase())
            )
        );


        // --- Resource recommendations ---
        const Resource = require("../models/Resource");
        const resources = await Resource.find();
        const recommendedResources = resources.filter(r =>
            r.tags && r.tags.some(tag => interests.includes(tag.toLowerCase()))
        ).slice(0, 3);

        res.json({
            communities: recommendedCommunities,
            events: recommendedEvents,
            opportunities: recommendedOpportunities,
            resources: recommendedResources
        });
    } catch (error) {
        console.error("Recommendation Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
