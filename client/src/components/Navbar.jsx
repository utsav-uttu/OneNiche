import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import "../styles/navbar.css";

function Navbar() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            {/* LEFT */}
            <div className="nav-left">
                <div className="logo">ON</div>
                <span className="brand">OneNiche</span>
            </div>

            {/* CENTER */}
            <div className="nav-center">
                {[
                    { path: "/", label: "Home" },
                    { path: "/communities", label: "Communities" },
                    { path: "/events", label: "Events" },
                    { path: "/resources", label: "Resources" },
                    { path: "/opportunities", label: "Opportunities" },
                ].map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={isActive(item.path) ? "active" : ""}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* RIGHT */}
            <div className="nav-right">
                {!user ? (
                    <>
                        <Link to="/login" className="nav-btn ghost">
                            Login
                        </Link>
                        <Link to="/register" className="nav-btn primary">
                            Get Started
                        </Link>
                    </>
                ) : (
                    <div className="user-menu" ref={menuRef}>
                        <button
                            className="user-trigger"
                            onClick={() => setOpen(!open)}
                        >
                            <div className="avatar">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="username">{user.name}</span>
                            <span className={`chevron ${open ? "rotate" : ""}`}>
                                ▾
                            </span>
                        </button>

                        {open && (
                            <div className="dropdown">
                                <div className="dropdown-header">
                                    <div className="avatar large">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="name">{user.name}</p>
                                        <p className="role">
                                            {user.role === "admin"
                                                ? "Administrator"
                                                : "Member"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        setOpen(false);
                                        navigate("/interests");
                                    }}
                                >
                                    My Interests
                                </button>

                                {user.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        className="dropdown-item"
                                        onClick={() => setOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}

                                <button
                                    className="dropdown-item danger"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;