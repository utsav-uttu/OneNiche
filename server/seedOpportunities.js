const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Opportunity = require("./models/Opportunity");
const Community = require("./models/Community");
const User = require("./models/User");

const seedOpportunities = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected for Opportunity Seeding");

        const communities = await Community.find();
        if (communities.length === 0) {
            console.log("No communities found! Please run seedHobbies.js first.");
            process.exit(1);
        }

        const user = await User.findOne();
        if (!user) {
            console.log("No users found! Please create a user first.");
            process.exit(1);
        }

        const findCommunity = (name) => {
            return communities.find(c => c.name.toLowerCase() === name.toLowerCase());
        };

        const opportunityTemplates = [
            // Coding Opportunities
            {
                title: "Frontend Developer Internship",
                type: "internship",
                description: "3-month internship working with React and Tailwind CSS. Remote.",
                skills: ["React", "JavaScript", "CSS"],
                community: findCommunity("Coding")?._id,
                postedBy: user._id
            },
            {
                title: "Freelance Web Developer",
                type: "gig",
                description: "Build a portfolio website for a design agency.",
                skills: ["HTML", "CSS", "JavaScript"],
                community: findCommunity("Coding")?._id,
                postedBy: user._id
            },
            {
                title: "Senior Backend Engineer",
                type: "job",
                description: "Full-time role. Experience with Node.js and MongoDB required.",
                skills: ["Node.js", "MongoDB", "Express"],
                community: findCommunity("Coding")?._id,
                postedBy: user._id
            },
            // AI/ML Opportunities
            {
                title: "ML Research Intern",
                type: "internship",
                description: "Research role focused on NLP foundation models.",
                skills: ["Python", "PyTorch", "NLP"],
                community: findCommunity("AI/ML")?._id,
                postedBy: user._id
            },
            // Photography Opportunities
            {
                title: "Wedding Photographer Assistant",
                type: "gig",
                description: "Assist lead photographer at a weekend wedding shoot.",
                skills: ["Photography", "Lighting"],
                community: findCommunity("Photography")?._id,
                postedBy: user._id
            },
            {
                title: "Product Photographer",
                type: "job",
                description: "In-house photographer for an e-commerce brand.",
                skills: ["Product Photography", "Editing"],
                community: findCommunity("Photography")?._id,
                postedBy: user._id
            },
            // Music Opportunities
            {
                title: "Sound Engineer for Podcast",
                type: "gig",
                description: "Mix and master weekly podcast episodes.",
                skills: ["Audio Engineering", "Editing"],
                community: findCommunity("Music Production")?._id,
                postedBy: user._id
            },
            // Yoga Opportunities
            {
                title: "Yoga Instructor",
                type: "job",
                description: "Part-time yoga instructor for a local studio.",
                skills: ["Yoga Certification", "Teaching"],
                community: findCommunity("Yoga")?._id,
                postedBy: user._id
            },
            // Writing/Reading Opportunities
            {
                title: "Content Writer",
                type: "gig",
                description: "Write blog posts about technology trends.",
                skills: ["Writing", "SEO"],
                community: findCommunity("Reading")?._id,
                postedBy: user._id
            }
        ];

        const validOpportunities = opportunityTemplates.filter(o => o.community);

        let createdCount = 0;
        let skippedCount = 0;

        for (const data of validOpportunities) {
            const existing = await Opportunity.findOne({ title: data.title });
            if (!existing) {
                await Opportunity.create(data);
                console.log(`✓ Created opportunity: ${data.title}`);
                createdCount++;
            } else {
                console.log(`- Skipped existing: ${data.title}`);
                skippedCount++;
            }
        }

        console.log(`\n🎉 Opportunity Seeding Complete!`);
        console.log(`Created: ${createdCount}`);
        console.log(`Skipped: ${skippedCount}`);

        process.exit();

    } catch (err) {
        console.error("❌ Opportunity Seeding Failed:", err);
        process.exit(1);
    }
};

seedOpportunities();
