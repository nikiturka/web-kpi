import React, { useState } from "react";
import { validateEmail, validatePassword, validateUsername } from "../../utils/validation";
import "../../styles/global.css";
import "../../styles/register-form.css";

const RegisterForm = ({ onShowToast,onSwitchToLogin }) => {
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const username = e.target.username.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        if (!username || !email || !password) {
            onShowToast?.("All fields are required!");
            setLoading(false);
            return;
        }

        if (!validateUsername(username)) {
            onShowToast?.("Username must be at least 3 characters!");
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            onShowToast?.("Invalid email format!");
            setLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            onShowToast?.("Password must be at least 6 characters!");
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
                onSwitchToLogin?.();
            } else {
                onShowToast?.(data.detail || "Registration failed");
            }
        } catch {
            onShowToast?.("Server error. Please try again later.");
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
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;

