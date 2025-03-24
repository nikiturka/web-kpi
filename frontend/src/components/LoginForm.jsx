import React, { useState } from "react";

const LoginForm = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const username = e.target.username.value;
        const password = e.target.password.value;

        if (!username || !password) {
            setError("Both fields are required!");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token); // Збереження токена
            alert("Logged in successfully!");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-box login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" required />
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
