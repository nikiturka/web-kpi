import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthComponents.css"; // Імпортуємо стилі для компонента

const LoginForm = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!email || !password) {
            setError("Both fields are required!");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");
                localStorage.setItem("token", data.token || "dummy_token");
                navigate("/main");
            } else {
                setError(data.detail || "Invalid credentials");
            }
        } catch (err) {
            setError("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-box login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
