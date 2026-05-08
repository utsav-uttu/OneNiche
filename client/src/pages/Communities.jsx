import { useEffect, useState } from "react";
import axios from "axios";
import Page from "../components/Page";
import "../styles/communities.css";

function Communities() {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const fetchCommunities = async () => {
        setLoading(true);
        // Use sorted endpoint if user is logged in
        const endpoint = user?.id
            ? `http://localhost:5001/api/communities/sorted/${user.id}`
            : "http://localhost:5001/api/communities";
        const res = await axios.get(endpoint);
        setCommunities(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    const joinCommunity = async (id) => {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        await axios.post(
            `http://localhost:5001/api/communities/${id}/join`,
            {},
            { headers }
        );
        if (!token) {
            localStorage.setItem(`guest_joined_${id}`, "true");
        }
        fetchCommunities();
    };

    const leaveCommunity = async (id) => {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        await axios.post(
            `http://localhost:5001/api/communities/${id}/leave`,
            {},
            { headers }
        );
        if (!token) {
            localStorage.removeItem(`guest_joined_${id}`);
        }
        fetchCommunities();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this community?")) return;
        try {
            await axios.delete(`http://localhost:5001/api/communities/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCommunities();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete community");
        }
    };

    return (
        <Page
            title="Communities"
            subtitle="Discover and join niche communities"
        >
            {loading && <p className="muted">Loading communities...</p>}

            {!loading && communities.length === 0 && (
                <p className="muted">No communities available yet.</p>
            )}

            <div className="community-grid">
                {communities.map((community) => {
                    const isMember = community.members.includes(user?.id || user?._id);
                    const canDelete = user && user.role === "admin";

                    return (
                        <div className="community-card" key={community._id}>
                            <div className="community-header">
                                <div className="title-area">
                                    <h3>{community.name}</h3>
                                    {community.matchesInterest && (
                                        <span className="interest-badge">Your Interest</span>
                                    )}
                                </div>
                                {canDelete && (
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(community._id)}
                                        title="Delete Community"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <p>{community.description}</p>

                            <div className="card-footer">
                                <span>{community.members.length + (community.guestMemberCount || 0)} members</span>

                                {!isMember && !localStorage.getItem(`guest_joined_${community._id}`) ? (
                                    <button
                                        className="btn-outline"
                                        onClick={() => joinCommunity(community._id)}
                                    >
                                        Join
                                    </button>
                                ) : (
                                    <button
                                        className="btn-secondary"
                                        onClick={() => leaveCommunity(community._id)}
                                    >
                                        Leave
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Page>
    );
}

export default Communities;