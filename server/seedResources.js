const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Resource = require("./models/Resource");
const Community = require("./models/Community");
const User = require("./models/User");

const seedResources = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected for Resource Seeding");

        // Get all communities to link resources to them
        const communities = await Community.find();
        if (communities.length === 0) {
            console.log("No communities found! Please run seedHobbies.js first.");
            process.exit(1);
        }

        // Get a user to attribute the resources to
        const user = await User.findOne();
        if (!user) {
            console.log("No users found! Please create a user first.");
            process.exit(1);
        }

        // Helper function to find community by name
        const findCommunity = (name) => {
            return communities.find(c => c.name.toLowerCase() === name.toLowerCase());
        };

        const resourceTemplates = [
            // Coding Resources
            {
                title: "React Documentation",
                link: "https://react.dev",
                type: "link",
                community: findCommunity("Coding")?._id,
                addedBy: user._id,
                tags: ["web development", "javascript", "frontend"]
            },
            {
                title: "You Don't Know JS",
                link: "https://github.com/getify/You-Dont-Know-JS",
                type: "handbook",
                community: findCommunity("Coding")?._id,
                addedBy: user._id,
                tags: ["javascript", "advanced", "books"]
            },
            {
                title: "Traversy Media - MERN Stack Guide",
                link: "https://www.youtube.com/watch?v=7CqJlxBYj-M",
                type: "youtube",
                community: findCommunity("Coding")?._id,
                addedBy: user._id,
                tags: ["mern", "fullstack", "tutorial"]
            },
            // AI/ML Resources
            {
                title: "Andrew Ng's Machine Learning Course",
                link: "https://www.coursera.org/learn/machine-learning",
                type: "link",
                community: findCommunity("AI/ML")?._id,
                addedBy: user._id,
                tags: ["ai", "machine learning", "course"]
            },
            {
                title: "Attention Is All You Need",
                link: "https://arxiv.org/abs/1706.03762",
                type: "pdf",
                community: findCommunity("AI/ML")?._id,
                addedBy: user._id,
                tags: ["research paper", "transformer", "nlp"]
            },
            // Photography Resources
            {
                title: "Composition in Photography",
                link: "https://petapixel.com/photography-composition-techniques/",
                type: "link",
                community: findCommunity("Photography")?._id,
                addedBy: user._id,
                tags: ["composition", "basics", "guide"]
            },
            {
                title: "Peter McKinnon - Photography Tutorials",
                link: "https://www.youtube.com/user/petermckinnon24",
                type: "youtube",
                community: findCommunity("Photography")?._id,
                addedBy: user._id,
                tags: ["tutorials", "editing", "vlogging"]
            },
            // Music Production Resources
            {
                title: "Ableton Live Manual",
                link: "https://www.ableton.com/en/manual/live-concepts/",
                type: "handbook",
                community: findCommunity("Music Production")?._id,
                addedBy: user._id,
                tags: ["daw", "manual", "ableton"]
            },
            {
                title: "Music Theory for Producers",
                link: "https://www.youtube.com/watch?v=rgaTLrZGlk0",
                type: "youtube",
                community: findCommunity("Music Production")?._id,
                addedBy: user._id,
                tags: ["theory", "production", "basics"]
            },
            // Yoga Resources
            {
                title: "Yoga with Adriene",
                link: "https://www.youtube.com/user/yogawithadriene",
                type: "youtube",
                community: findCommunity("Yoga")?._id,
                addedBy: user._id,
                tags: ["yoga", "home workout", "wellness"]
            },
            // Cooking Resources
            {
                title: "Basics with Babish",
                link: "https://basicswithbabish.co/",
                type: "link",
                community: findCommunity("Cooking")?._id,
                addedBy: user._id,
                tags: ["recipes", "basics", "cooking"]
            },
            {
                title: "Salt, Fat, Acid, Heat",
                link: "https://www.saltfatacidheat.com/",
                type: "link",
                community: findCommunity("Cooking")?._id,
                addedBy: user._id,
                tags: ["theory", "science", "cooking"]
            }
        ];

        // Filter out resources with undefined communities
        const validResources = resourceTemplates.filter(r => r.community);

        let createdCount = 0;
        let skippedCount = 0;

        for (const data of validResources) {
            const existing = await Resource.findOne({ title: data.title });
            if (!existing) {
                await Resource.create(data);
                console.log(`✓ Created resource: ${data.title}`);
                createdCount++;
            } else {
                console.log(`- Skipped existing: ${data.title}`);
                skippedCount++;
            }
        }

        console.log(`\n🎉 Resource Seeding Complete!`);
        console.log(`Created: ${createdCount}`);
        console.log(`Skipped: ${skippedCount}`);

        process.exit();

    } catch (err) {
        console.error("❌ Resource Seeding Failed:", err);
        process.exit(1);
    }
};

seedResources();
