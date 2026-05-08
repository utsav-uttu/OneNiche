import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import hobbiesData from "../data/hobbies.json";
import axios from "axios";
import "../styles/interests.css";

function Interests() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedHobbies, setSelectedHobbies] = useState(user?.interests || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const toggleHobby = (hobby) => {
        if (selectedHobbies.includes(hobby)) {
            setSelectedHobbies(selectedHobbies.filter((h) => h !== hobby));
        } else {
            if (selectedHobbies.length >= 3) {
                return;
            }
            setSelectedHobbies([...selectedHobbies, hobby]);
        }
    };

    const handleSubmit = async () => {
        if (selectedHobbies.length === 0) {
            setError("Please select at least one interest");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await axios.put(
                "http://localhost:5001/api/users/interests",
                { interests: selectedHobbies },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // Update local user context if possible, or force re-fetch
            // Assuming login function can accept user data updates or we manually update it
            // For now, we might need to reload or manually update context if 'login' isn't just for setting token
            // A simple hack: update the user object in context manually if exposed, or just navigate
            // Ideally AuthContext should have an update function. 
            // Since we can't see AuthContext, we'll assume navigation is enough and maybe a window reload or handled by Home check.
            // Update local storage
            const currentUser = JSON.parse(localStorage.getItem("user"));
            if (currentUser) {
                currentUser.interests = res.data.interests;
                localStorage.setItem("user", JSON.stringify(currentUser));
            }

            navigate("/");
            // Force reload to update context from localStorage
            // Using window.location.href ensures we are on the Home page when reloading
            window.location.href = "/";
        } catch (err) {
            setError("Failed to save interests");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="interests-page">
            <div className="interests-container">
                <h1>Welcome, {user?.name}!</h1>
                <p className="subtitle">Select up to 3 topics you are interested in.</p>

                {error && <div className="error-msg">{error}</div>}

                <div className="categories-grid">
                    {hobbiesData.map((cat) => (
                        <div key={cat.category} className="category-section">
                            <h3>{cat.category}</h3>
                            <div className="hobbies-list">
                                {cat.hobbies.map((hobby) => (
                                    <button
                                        key={hobby}
                                        className={`hobby-chip ${selectedHobbies.includes(hobby) ? "active" : ""
                                            }`}
                                        onClick={() => toggleHobby(hobby)}
                                        disabled={
                                            !selectedHobbies.includes(hobby) &&
                                            selectedHobbies.length >= 3
                                        }
                                    >
                                        {hobby}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="action-bar">
                    <p>{selectedHobbies.length}/3 selected</p>
                    <button
                        className="continue-btn"
                        onClick={handleSubmit}
                        disabled={loading || selectedHobbies.length === 0}
                    >
                        {loading ? "Saving..." : "Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Interests;
