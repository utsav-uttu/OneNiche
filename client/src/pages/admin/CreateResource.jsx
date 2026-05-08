import { useState } from "react";
import axios from "axios";

export default function CreateResource() {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [type, setType] = useState("Link");

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5001/api/resources",
                { title, link, type },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Resource added");
            setTitle("");
            setLink("");
        } catch (err) {
            alert("Failed to add resource");
            console.error(err);
        }
    };

    return (
        <div className="admin-form-card">
            <h2>Add Resource</h2>

            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                placeholder="Resource Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option>Link</option>
                <option>PDF</option>
                <option>Video</option>
            </select>

            <button onClick={handleCreate}>Add Resource</button>
        </div>
    );
}