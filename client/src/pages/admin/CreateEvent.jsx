import { useState } from "react";
import axios from "axios";

export default function CreateEvent() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [venue, setVenue] = useState("");

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5001/api/events",
                { title, description, date, venue },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Event created successfully");
            setTitle("");
            setDescription("");
            setDate("");
            setVenue("");
        } catch (err) {
            alert("Failed to create event");
            console.error(err);
        }
    };

    return (
        <div className="admin-form-card">
            <h2>Create Event</h2>

            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <input
                placeholder="Venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
            />

            <button onClick={handleCreate}>Create</button>
        </div>
    );
}