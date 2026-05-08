const express = require("express");
const Resource = require("../models/Resource");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

/* CREATE RESOURCE */
router.post("/", auth, adminAuth, async (req, res) => {
    try {
        const { title, link, type } = req.body;

        const resource = new Resource({
            title,
            link,
            type: type.toLowerCase(),
            addedBy: req.user._id,
        });

        await resource.save();
        res.status(201).json(resource);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* GET ALL RESOURCES */
router.get("/", async (req, res) => {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
});

/* UPDATE RESOURCE */
router.put("/:id", auth, adminAuth, async (req, res) => {
    try {
        const updated = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch {
        res.status(400).json({ message: "Update failed" });
    }
});

/* DELETE RESOURCE */
router.delete("/:id", auth, adminAuth, async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch {
        res.status(400).json({ message: "Delete failed" });
    }
});

module.exports = router;