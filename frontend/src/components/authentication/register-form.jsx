import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword, validateUsername } from "../../utils/validation";
import "../../styles/global.css";
import "../../styles/register-form.css";

const RegisterForm = ({ onShowToast }) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const username = e.target.username.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        if (!username || !email || !password) {
            const errorMsg = "All fields are required!";
            setError(errorMsg);
            onShowToast?.(errorMsg);
            setLoading(false);
            return;
        }

        if (!validateUsername(username)) {
            const errorMsg = "Username must be at least 3 characters!";
            setError(errorMsg);
            onShowToast?.(errorMsg);
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            const errorMsg = "Invalid email format!";
            setError(errorMsg);
            onShowToast?.(errorMsg);
            setLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            const errorMsg = "Password must be at least 6 characters!";
            setError(errorMsg);
            onShowToast?.(errorMsg);
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
                onShowToast?.("Registration successful!");
                navigate("/");
            } else {
                const errorMsg = data.detail || "Registration failed";
                setError(errorMsg);
                onShowToast?.(errorMsg);
            }
        } catch {
            const errorMsg = "Server error. Please try again later.";
            setError(errorMsg);
            onShowToast?.(errorMsg);
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
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
