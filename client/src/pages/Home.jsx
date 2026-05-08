import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import Hero from "../components/Hero";
import axios from "axios";
import hobbiesData from "../data/hobbies.json";
import "../styles/home.css"; // Styles for Grid and Recommendations

function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState(null);

    // Generate dynamic discovery suggestions based on user interests
    const discoverySuggestions = useMemo(() => {
        if (!user?.interests) return [];

        // Flatten all hobbies from hobbiesData
        const allHobbies = hobbiesData.flatMap(cat => cat.hobbies);

        // Filter out user's current interests
        const availableHobbies = allHobbies.filter(
            hobby => !user.interests.includes(hobby)
        );

        // Shuffle and take 4 random suggestions
        return availableHobbies
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
    }, [user?.interests?.join(',')]);

    useEffect(() => {
        if (user) {
            if (!user.interests || user.interests.length === 0) {
                navigate("/interests");
            } else {
                fetchRecommendations();
            }
        }
    }, [user?.id, user?.interests?.join(','), navigate]);

    const fetchRecommendations = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/recommendations/${user.id || user._id}`);
            setRecommendations(res.data);
        } catch (err) {
            console.error("Failed to fetch recommendations", err);
        }
    };

    return (
        <main className="home">
            <Hero />

            {/* RECOMMENDATIONS */}
            {user && recommendations && (
                <section className="recommendations-container">
                    {/* Interests Showcase */}
                    <div className="interests-showcase">
                        <div className="showcase-header">
                            <h2>Your Interests</h2>
                            <button onClick={() => navigate("/interests")} className="edit-interests-btn">
                                <span>Edit</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="interests-list">
                            {user.interests?.map(i => (
                                <div key={i} className="interest-pill">
                                    <span className="hash">#</span>{i}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section-divider"></div>

                    <div className="recommendations-showcase">
                        <div className="interests-header">
                            <h2>Recommended for You</h2>
                        </div>

                        <div className="discovery-section">
                            <p className="discovery-label">You might also like:</p>
                            <div className="discovery-chips">
                                {discoverySuggestions.map(tag => (
                                    <span key={tag} className="discovery-chip">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="rec-grid">
                            {/* Communities */}
                            {recommendations.communities?.length > 0 && (
                                <div className="rec-category">
                                    <h3>Communities</h3>
                                    <div className="rec-list">
                                        {recommendations.communities.map(c => (
                                            <div key={c._id} className="rec-card community-card">
                                                <h4>{c.name}</h4>
                                                <p>{c.description?.substring(0, 60)}...</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Resources */}
                            {recommendations.resources?.length > 0 && (
                                <div className="rec-category">
                                    <h3>Resources</h3>
                                    <div className="rec-list">
                                        {recommendations.resources.map(r => (
                                            <a href={r.link} target="_blank" rel="noopener noreferrer" key={r._id} className="rec-card resource-card">
                                                <h4>{r.title}</h4>
                                                <span className="type-badge">{r.type}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Opportunities */}
                            {recommendations.opportunities?.length > 0 && (
                                <div className="rec-category">
                                    <h3>Opportunities</h3>
                                    <div className="rec-list">
                                        {recommendations.opportunities.map(o => (
                                            <div key={o._id} className="rec-card opp-card">
                                                <h4>{o.title}</h4>
                                                <p>{o.company}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* STATS */}
            <section className="home-stats">
                <div className="stat">
                    <h3>1.2k+</h3>
                    <span>Active members</span>
                </div>
                <div className="stat">
                    <h3>230</h3>
                    <span>Communities</span>
                </div>
                <div className="stat">
                    <h3>480</h3>
                    <span>Events</span>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="categories">
                <h2>Fun Categories to Join</h2>
                <p className="subtitle">
                    Find communities that match your passion
                </p>

                <div className="category-grid">
                    {[
                        { icon: "📸", title: "Photography", text: "Shoots, walks & edits" },
                        { icon: "🎵", title: "Music", text: "Collaborate & perform" },
                        { icon: "💻", title: "Coding", text: "Build & learn together" },
                        { icon: "🎬", title: "Filmmaking", text: "Short films & reels" },
                        { icon: "💃", title: "Dance", text: "Practice & perform" },
                        { icon: "🎨", title: "Design", text: "UI, UX & branding" },
                    ].map((item) => (
                        <div className="category-card" key={item.title}>
                            <span className="icon">{item.icon}</span>
                            <h4>{item.title}</h4>
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>

                <div className="explore-more-container">
                    {/* Explore Button */}
                    <button onClick={() => navigate("/communities")} className="explore-btn">
                        Explore Communities
                    </button>
                </div>
            </section>
        </main>
    );
}

export default Home;
