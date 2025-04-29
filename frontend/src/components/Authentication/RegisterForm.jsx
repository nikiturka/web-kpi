import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthComponents.css";

const RegisterForm = () => {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!username || !email || !password) {
            setError("All fields are required!");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Registration successful!");
                setTimeout(() => navigate("/"), 1000);
            } else {
                setError(data.detail || "Registration failed");
            }
        } catch (err) {
            setError("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-box register">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
