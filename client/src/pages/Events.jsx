import { useEffect, useState } from "react";
import axios from "axios";
import Page from "../components/Page";
import "../styles/events.css";

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const fetchEvents = async () => {
        setLoading(true);
        // Use sorted endpoint if user is logged in
        const endpoint = user?.id
            ? `http://localhost:5001/api/events/sorted/${user.id}`
            : "http://localhost:5001/api/events";
        const res = await axios.get(endpoint);
        setEvents(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const rsvpEvent = async (id) => {
        await axios.post(
            `http://localhost:5001/api/events/${id}/rsvp`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchEvents();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await axios.delete(`http://localhost:5001/api/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEvents();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete event");
        }
    };

    return (
        <Page
            title="Events"
            subtitle="Attend workshops, meetups and community events"
        >
            {loading && <p className="muted">Loading events...</p>}

            {!loading && events.length === 0 && (
                <p className="muted">No upcoming events.</p>
            )}

            <div className="event-grid">
                {events.map((event) => {
                    const joined = event.attendees.includes(user?.id || user?._id);
                    const canDelete = user && user.role === "admin";

                    return (
                        <div className="event-card" key={event._id}>
                            <div className="event-date">
                                {new Date(event.date).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                })}
                            </div>

                            <div className="event-header">
                                <div className="title-area">
                                    <h3>{event.title}</h3>
                                    {event.matchesInterest && (
                                        <span className="interest-badge">Your Interest</span>
                                    )}
                                </div>
                                {canDelete && (
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(event._id)}
                                        title="Delete Event"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <p className="event-desc">{event.description}</p>

                            {event.community && (
                                <div className="event-community">
                                    <span className="community-label">🏘️ {event.community.name}</span>
                                </div>
                            )}

                            <div className="event-info">
                                <span>📍 {event.venue}</span>
                                <span>👥 {event.attendees.length} attending</span>
                            </div>

                            <button
                                className="btn-primary"
                                disabled={joined}
                                onClick={() => rsvpEvent(event._id)}
                            >
                                {joined ? "Joined" : "RSVP"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </Page>
    );
}

export default Events;