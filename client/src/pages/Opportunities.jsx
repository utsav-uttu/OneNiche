import { useEffect, useState } from "react";
import axios from "axios";
import Page from "../components/Page";
import "../styles/opportunities.css";

function Opportunities() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const fetchOpportunities = async () => {
        setLoading(true);
        const res = await axios.get("http://localhost:5001/api/opportunities");
        setOpportunities(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const applyOpportunity = async (id) => {
        await axios.post(
            `http://localhost:5001/api/opportunities/${id}/apply`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchOpportunities();
    };

    return (
        <Page
            title="Opportunities"
            subtitle="Internships, gigs and job openings"
        >
            {loading && <p className="muted">Loading opportunities...</p>}

            {!loading && opportunities.length === 0 && (
                <p className="muted">No opportunities available.</p>
            )}

            <div className="opportunity-grid">
                {opportunities.map((op) => {
                    const applied = op.applicants.includes(user?.id);

                    return (
                        <div 
                            className="opportunity-card" 
                            key={op._id}
                            onClick={() => window.open(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(op.title)}`, '_blank')}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className={`badge ${op.type}`}>
                                {op.type.toUpperCase()}
                            </span>

                            <h3>{op.title}</h3>
                            <p className="op-desc">{op.description}</p>

                            <div className="skills">
                                {op.skills.map((skill) => (
                                    <span key={skill}>{skill}</span>
                                ))}
                            </div>

                            <button
                                className="btn-primary"
                                disabled={applied}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    applyOpportunity(op._id);
                                }}
                            >
                                {applied ? "Applied" : "Apply"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </Page>
    );
}

export default Opportunities;