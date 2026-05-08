import { useEffect, useState } from "react";
import axios from "axios";
import Page from "../components/Page";
import "../styles/resources.css";

function Resources() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchResources = async () => {
        setLoading(true);
        const res = await axios.get("http://localhost:5001/api/resources");
        setResources(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchResources();
    }, []);

    return (
        <Page
            title="Learning Resources"
            subtitle="Guides, PDFs and videos shared by communities"
        >
            {loading && <p className="muted">Loading resources...</p>}

            {!loading && resources.length === 0 && (
                <p className="muted">No learning resources added yet.</p>
            )}

            <div className="resource-grid">
                {resources.map((resource) => (
                    <div className="resource-card" key={resource._id}>
                        <span className={`badge ${resource.type}`}>
                            {resource.type.toUpperCase()}
                        </span>

                        <h3>{resource.title}</h3>

                        <a
                            href={resource.link}
                            target="_blank"
                            rel="noreferrer"
                            className="resource-link"
                        >
                            Open resource →
                        </a>
                    </div>
                ))}
            </div>
        </Page>
    );
}

export default Resources;