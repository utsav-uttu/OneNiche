const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Community = require("./models/Community");

const hobbiesFile = path.join(__dirname, "../client/src/data/hobbies.json");

const seedCommunities = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected for Seeding");

        const data = fs.readFileSync(hobbiesFile, "utf-8");
        const hobbiesData = JSON.parse(data);

        let createdCount = 0;
        let skippedCount = 0;

        for (const category of hobbiesData) {
            for (const hobby of category.hobbies) {
                const existingCommunity = await Community.findOne({ name: hobby });

                if (!existingCommunity) {
                    await Community.create({
                        name: hobby,
                        description: `Join the ${hobby} community to connect with others who share your passion!`,
                        guestMemberCount: Math.floor(Math.random() * 50) + 10, // heuristic for "fun" stats
                    });
                    console.log(`Created community: ${hobby}`);
                    createdCount++;
                } else {
                    console.log(`Skipped existing: ${hobby}`);
                    skippedCount++;
                }
            }
        }

        console.log(`\nSeeding Complete! Created: ${createdCount}, Skipped: ${skippedCount}`);
        process.exit();
    } catch (err) {
        console.error("Seeding Failed:", err);
        process.exit(1);
    }
};

seedCommunities();
