import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin.css";

export default function CreateCommunity() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [communities, setCommunities] = useState([]);

    const token = localStorage.getItem("token");

    const fetchCommunities = async () => {
        const res = await axios.get("http://localhost:5001/api/communities");
        setCommunities(res.data);
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    const handleCreate = async () => {
        if (!name || !description) return alert("Fill all fields");

        try {
            await axios.post(
                "http://localhost:5001/api/communities",
                { name, description },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setName("");
            setDescription("");
            fetchCommunities();
        } catch (err) {
            alert("Failed to create community");
            console.error(err);
        }
    };

    return (
        <>
            <h1>Communities</h1>
            <p className="subtitle">Create and manage communities</p>

            <div className="admin-form-card">
                <div className="form-row">
                    <input
                        placeholder="Community name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button onClick={handleCreate}>Create</button>
                </div>
            </div>

            <div className="admin-list-card">
                {communities.map((c) => (
                    <div key={c._id} className="admin-list-row">
                        <div>
                            <strong>{c.name}</strong>
                            <p>{c.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}