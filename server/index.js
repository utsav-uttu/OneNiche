const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
    res.send("OneNiche API Running");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/communities", require("./routes/community"));
app.use("/api/resources", require("./routes/resource"));
app.use("/api/events", require("./routes/event"));
app.use("/api/opportunities", require("./routes/opportunity"));
app.use("/api/recommendations", require("./routes/recommendation"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));


/* ================= DATABASE ================= */
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");

        /* ================= SERVER ================= */
        const PORT = 5001;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    });
