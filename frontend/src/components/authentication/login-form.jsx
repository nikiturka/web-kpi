import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/validation";
import { useAuth } from "../context/auth-context";
import "../../styles/global.css";
import "../../styles/login-form.css";

const LoginForm = ({ onShowToast }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        if (!email || !password) {
            onShowToast?.("Both fields are required!");
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
            const response = await fetch("http://127.0.0.1:8000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token || "dummy_token");
                onShowToast?.("Login successful!");
                navigate("/rooms");
            } else {
                onShowToast?.(data.detail || "Invalid credentials");
            }
        } catch {
            onShowToast?.("Server error. Please try again later.");
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
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
