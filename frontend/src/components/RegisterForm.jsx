import React, { useState } from "react";

const RegisterForm = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
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
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            alert("Registered successfully!");
        } catch (err) {
            setError(err.message);
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
