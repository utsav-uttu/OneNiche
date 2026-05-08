const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// UPDATE User Interests
router.put("/interests", auth, async (req, res) => {
    try {
        const { interests } = req.body;

        if (!interests || !Array.isArray(interests)) {
            return res.status(400).json({ message: "Interests must be an array" });
        }

        if (interests.length > 3) {
            return res.status(400).json({ message: "You can select up to 3 interests only" });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { interests },
            { new: true }
        ).select("-password");

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
