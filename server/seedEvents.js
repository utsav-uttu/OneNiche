const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Event = require("./models/Event");
const Community = require("./models/Community");

const seedEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected for Event Seeding");

        // Get all communities to link events to them
        const communities = await Community.find();

        if (communities.length === 0) {
            console.log("No communities found! Please run seedHobbies.js first.");
            process.exit(1);
        }

        // Helper function to get random future date
        const getRandomFutureDate = (daysAhead) => {
            const date = new Date();
            date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
            return date;
        };

        // Helper function to find community by name
        const findCommunity = (name) => {
            return communities.find(c => c.name.toLowerCase() === name.toLowerCase());
        };

        // Event templates for different types
        const eventTemplates = [
            // Photography Events
            {
                title: "Golden Hour Photography Walk",
                description: "Join us for a sunset photography session. Capture stunning golden hour shots and learn composition techniques.",
                venue: "Marine Drive, Mumbai",
                community: findCommunity("Photography")?._id,
                date: getRandomFutureDate(30)
            },
            {
                title: "Portrait Photography Workshop",
                description: "Master the art of portrait photography with professional lighting and posing techniques.",
                venue: "Studio 23, Bandra",
                community: findCommunity("Photography")?._id,
                date: getRandomFutureDate(45)
            },
            // Coding Events
            {
                title: "React Masterclass: Building Modern UIs",
                description: "Deep dive into React hooks, state management, and performance optimization.",
                venue: "TechHub Bangalore",
                community: findCommunity("Coding")?._id,
                date: getRandomFutureDate(20)
            },
            {
                title: "Hackathon: Build for Good",
                description: "24-hour hackathon focused on creating solutions for social impact. Prizes worth ₹1 Lakh!",
                venue: "IIT Delhi Campus",
                community: findCommunity("Coding")?._id,
                date: getRandomFutureDate(60)
            },
            {
                title: "AI/ML Workshop: Getting Started",
                description: "Introduction to machine learning with hands-on Python projects.",
                venue: "Online (Zoom)",
                community: findCommunity("AI/ML")?._id,
                date: getRandomFutureDate(15)
            },
            // Music Events
            {
                title: "Open Mic Night",
                description: "Showcase your musical talent! All instruments and genres welcome.",
                venue: "Blue Frog, Mumbai",
                community: findCommunity("Music Production")?._id,
                date: getRandomFutureDate(10)
            },
            {
                title: "Electronic Music Production Bootcamp",
                description: "Learn to produce electronic music using Ableton Live and industry techniques.",
                venue: "Sound Academy, Pune",
                community: findCommunity("Music Production")?._id,
                date: getRandomFutureDate(35)
            },
            // Yoga & Fitness Events
            {
                title: "Sunrise Yoga Session",
                description: "Start your day with energizing yoga by the beach. All levels welcome!",
                venue: "Juhu Beach, Mumbai",
                community: findCommunity("Yoga")?._id,
                date: getRandomFutureDate(7)
            },
            {
                title: "Marathon Training Group",
                description: "Join our weekly running group preparing for the upcoming city marathon.",
                venue: "Cubbon Park, Bangalore",
                community: findCommunity("Running")?._id,
                date: getRandomFutureDate(5)
            },
            // Gaming Events
            {
                title: "Chess Tournament: Blitz Edition",
                description: "Fast-paced chess tournament with prizes for top 3 players. Rating: 1200+",
                venue: "Chess Club, Kolkata",
                community: findCommunity("Chess")?._id,
                date: getRandomFutureDate(25)
            },
            {
                title: "Esports Championship: Valorant",
                description: "5v5 Valorant tournament. Register your team now! Prize pool: ₹50,000",
                venue: "Gaming Arena, Hyderabad",
                community: findCommunity("Esports")?._id,
                date: getRandomFutureDate(40)
            },
            // Art & Creative Events
            {
                title: "Watercolor Painting Workshop",
                description: "Learn watercolor techniques from landscape to abstract art. Materials provided.",
                venue: "Art Studio, Delhi",
                community: findCommunity("Painting")?._id,
                date: getRandomFutureDate(18)
            },
            {
                title: "Digital Art Meetup",
                description: "Share your digital artwork, get feedback, and network with fellow digital artists.",
                venue: "Creative Hub, Gurgaon",
                community: findCommunity("Digital Art")?._id,
                date: getRandomFutureDate(12)
            },
            // Cooking Events
            {
                title: "Italian Cuisine Masterclass",
                description: "Learn to make authentic pasta, risotto, and tiramisu from scratch.",
                venue: "Culinary Institute, Mumbai",
                community: findCommunity("Cooking")?._id,
                date: getRandomFutureDate(22)
            },
            {
                title: "Baking Workshop: Artisan Breads",
                description: "Master the art of sourdough and artisan bread baking.",
                venue: "Baker's Kitchen, Bangalore",
                community: findCommunity("Baking")?._id,
                date: getRandomFutureDate(28)
            },
            // Dance Events
            {
                title: "Salsa Night: Beginners Welcome",
                description: "Learn salsa basics and dance the night away! No partner needed.",
                venue: "Dance Floor, Pune",
                community: findCommunity("Dancing")?._id,
                date: getRandomFutureDate(8)
            },
            // Reading & Learning Events
            {
                title: "Book Club: Sci-Fi Month",
                description: "Discussion on 'Dune' by Frank Herbert. Coffee and snacks provided.",
                venue: "Cafe Bibliophile, Delhi",
                community: findCommunity("Reading")?._id,
                date: getRandomFutureDate(14)
            },
            {
                title: "Philosophy Debate: Ethics in AI",
                description: "Engaging discussion on ethical implications of artificial intelligence.",
                venue: "University Auditorium, Chennai",
                community: findCommunity("Philosophy")?._id,
                date: getRandomFutureDate(30)
            },
            // Outdoor Events
            {
                title: "Weekend Trek: Rajmachi Fort",
                description: "Moderate difficulty trek with camping. Experience nature and history!",
                venue: "Lonavala (Meeting Point)",
                community: findCommunity("Hiking")?._id,
                date: getRandomFutureDate(21)
            },
            {
                title: "Rock Climbing Workshop",
                description: "Learn basic rock climbing techniques with certified instructors. Safety gear provided.",
                venue: "Adventure Sports Center, Rishikesh",
                community: findCommunity("Rock Climbing")?._id,
                date: getRandomFutureDate(50)
            },
            // Tech Events
            {
                title: "Blockchain & Web3 Meetup",
                description: "Explore the future of decentralized applications and smart contracts.",
                venue: "Tech Park, Bangalore",
                community: findCommunity("Blockchain")?._id,
                date: getRandomFutureDate(17)
            },
            {
                title: "Cybersecurity Workshop",
                description: "Hands-on session on ethical hacking and network security fundamentals.",
                venue: "Cyber Lab, Mumbai",
                community: findCommunity("Cybersecurity")?._id,
                date: getRandomFutureDate(33)
            },
            // Lifestyle Events
            {
                title: "Travel Photography & Storytelling",
                description: "Share your travel stories and learn to capture memorable moments.",
                venue: "Traveler's Cafe, Goa",
                community: findCommunity("Travel")?._id,
                date: getRandomFutureDate(26)
            },
            {
                title: "Meditation & Mindfulness Retreat",
                description: "Full-day retreat focused on meditation techniques and mental wellness.",
                venue: "Wellness Center, Rishikesh",
                community: findCommunity("Meditation")?._id,
                date: getRandomFutureDate(42)
            }
        ];

        // Filter out events with undefined communities
        const validEvents = eventTemplates.filter(event => event.community);

        let createdCount = 0;
        let skippedCount = 0;

        for (const eventData of validEvents) {
            // Check if similar event already exists
            const existingEvent = await Event.findOne({
                title: eventData.title
            });

            if (!existingEvent) {
                await Event.create(eventData);
                console.log(`✓ Created event: ${eventData.title}`);
                createdCount++;
            } else {
                console.log(`- Skipped existing: ${eventData.title}`);
                skippedCount++;
            }
        }

        console.log(`\n🎉 Event Seeding Complete!`);
        console.log(`Created: ${createdCount} events`);
        console.log(`Skipped: ${skippedCount} events`);
        console.log(`Total communities found: ${communities.length}`);

        process.exit();
    } catch (err) {
        console.error("❌ Event Seeding Failed:", err);
        process.exit(1);
    }
};

seedEvents();
