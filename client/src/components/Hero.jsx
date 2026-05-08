import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GridBackground from "./Effects/GridBackground";
import "../styles/hero.css";
import "../styles/home.css";

function Hero() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        setIsVisible(true);
    }, []);

    return (
        <section className="hero">
            <GridBackground />

            {/* Floating decorative elements */}
            <div className="hero-decorations">
                <div className="floating-orb orb-1"></div>
                <div className="floating-orb orb-2"></div>
                <div className="floating-orb orb-3"></div>
            </div>

            <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
                <div className="badge-container">
                    <span className="badge">
                        <span className="badge-icon">✨</span>
                        DISCOVER YOUR PASSION
                    </span>
                </div>

                <h1 className="hero-title">
                    <span className="title-line">
                        Find your <span className="gradient-text">tribe</span>.
                    </span>
                    <span className="title-line">
                        Create <span className="gradient-text">together</span>.
                    </span>
                </h1>

                <p className="hero-description">
                    OneNiche connects creators, learners and makers into meaningful
                    communities — without noise or clutter. Join thousands building
                    something amazing.
                </p>

                <div className="hero-actions">
                    <button className="btn primary" onClick={() => navigate("/communities")}>
                        <span>Explore Communities</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button className="btn ghost" onClick={() => navigate("/events")}>
                        <span>Browse Events</span>
                    </button>
                </div>

                {/* Stats preview */}
                <div className="hero-stats">
                    <div className="stat-item">
                        <div className="stat-number">1.2k+</div>
                        <div className="stat-label">Active Members</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">230</div>
                        <div className="stat-label">Communities</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">480</div>
                        <div className="stat-label">Events</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
