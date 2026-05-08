const express = require("express");
const Opportunity = require("../models/Opportunity");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

/* GET ALL OPPORTUNITIES */
router.get("/", async (req, res) => {
    const opportunities = await Opportunity.find().sort({ createdAt: -1 });
    res.json(opportunities);
});

/* CREATE OPPORTUNITY (ADMIN ONLY) */
router.post("/", auth, adminAuth, async (req, res) => {
    const { title, type, description, skills, community } = req.body;

    const opportunity = new Opportunity({
        title,
        type,
        description,
        skills,
        community,
        postedBy: req.user._id,
    });

    await opportunity.save();
    res.status(201).json({ message: "Opportunity created", opportunity });
});

/* APPLY FOR OPPORTUNITY */
router.post("/:id/apply", auth, async (req, res) => {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity.applicants.includes(req.user._id)) {
        opportunity.applicants.push(req.user._id);
        await opportunity.save();
    }

    res.json({ message: "Applied successfully" });
});

/* WITHDRAW APPLICATION */
router.post("/:id/leave", auth, async (req, res) => {
    try {
        await Opportunity.findByIdAndUpdate(req.params.id, {
            $pull: { applicants: req.user._id },
        });
        res.json({ message: "Withdrawn successfully" });
    } catch {
        res.status(400).json({ message: "Withdraw failed" });
    }
});

module.exports = router;
