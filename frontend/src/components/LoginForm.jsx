import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Хук для навігації

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!email || !password) {
            setError("Both fields are required!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token); // Збереження токена (якщо бекенд повертає JWT)
                navigate("/main"); // Перехід на головну сторінку
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div className="form-box login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" required/>
                <input type="password" name="password" placeholder="Password" required/>
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
