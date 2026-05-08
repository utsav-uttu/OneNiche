import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import axios from "axios";
import "../styles/auth.css";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("http://localhost:5001/api/auth/login", {
                email,
                password,
            });

            // save login data using context
            login(res.data.user, res.data.token);

            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>Welcome back</h1>
                <p className="auth-subtitle">
                    Login to continue to <strong>OneNiche</strong>
                </p>

                {error && <div className="auth-error">{error}</div>}

                <label>Email</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="auth-btn">
                    Login
                </button>

                <p className="auth-footer">
                    Don’t have an account?{" "}
                    <Link to="/register">Create one</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
