import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/validation";
import "../../styles/global.css";
import "../../styles/login-form.css";

const LoginForm = ({ onShowToast }) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        if (!email || !password) {
            const errorMsg = "Both fields are required!";
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
            const response = await fetch("http://127.0.0.1:8000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token || "dummy_token");
                onShowToast?.("Login successful!");
                navigate("/rooms");
            } else {
                const errorMsg = data.detail || "Invalid credentials";
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
