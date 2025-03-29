import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Хук для навігації

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!name || !email || !password) {
            setError("All fields are required!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful!");
                navigate("/"); // Після реєстрації переходимо на сторінку логіну
            } else {
                setError(data.detail || "Registration failed");
            }
        } catch (err) {
            setError("Server error. Please try again later.");
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterForm;
