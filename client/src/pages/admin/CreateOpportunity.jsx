import { useState } from "react";
import axios from "axios";

export default function CreateOpportunity() {
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [applyLink, setApplyLink] = useState("");

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5001/api/opportunities",
                { title, company, applyLink },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Opportunity created");
            setTitle("");
            setCompany("");
            setApplyLink("");
        } catch (err) {
            alert("Failed to create opportunity");
            console.error(err);
        }
    };

    return (
        <div className="admin-form-card">
            <h2>Create Opportunity</h2>

            <input
                placeholder="Role / Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />
            <input
                placeholder="Application Link"
                value={applyLink}
                onChange={(e) => setApplyLink(e.target.value)}
            />

            <button onClick={handleCreate}>Create</button>
        </div>
    );
}