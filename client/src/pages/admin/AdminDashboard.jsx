import "../../styles/admin.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        axios
            .get("http://localhost:5001/api/admin/stats", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setStats(res.data))
            .catch(() => setStats(null));
    }, []);

    if (!stats) {
        return (
            <div className="admin-cards">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton" />
                ))}
            </div>
        );
    }

    const cards = [
        { label: "Users", value: stats.users },
        { label: "Communities", value: stats.communities },
        { label: "Events", value: stats.events },
        { label: "Resources", value: stats.resources },
        { label: "Opportunities", value: stats.opportunities },
    ];

    return (
        <>
            {/* HEADER */}
            <motion.h1
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Admin Dashboard
            </motion.h1>

            <p className="subtitle">
                Platform overview & activity summary
            </p>

            {/* STATS CARDS */}
            <div className="admin-cards">
                {cards.map((c) => (
                    <motion.div
                        key={c.label}
                        className="admin-card"
                        whileHover={{ y: -6 }}
                    >
                        <h3>{c.value}</h3>
                        <p>{c.label}</p>
                        <span>View details →</span>
                    </motion.div>
                ))}
            </div>

            {/* CHART */}
            <div className="chart-card">
                <h3>Platform Growth</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={cards}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                            dataKey="value"
                            fill="#6366f1"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="admin-table">
                <h3>Recent Activity</h3>

                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Title</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recent.map((r, i) => (
                            <tr key={i}>
                                <td>{r.type}</td>
                                <td>{r.title}</td>
                                <td>{r.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}