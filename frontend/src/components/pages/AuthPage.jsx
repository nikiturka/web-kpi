import React, { useState } from "react";
import LoginForm from "../Authentication/LoginForm.jsx";
import RegisterForm from "../Authentication/RegisterForm.jsx";
import ToggleBox from "../Authentication/ToggleBox.jsx";
import "../../styles/AuthComponents.css"; // Імпортуємо стилі для компонента

const AuthPage = () => {
    const [active, setActive] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    const handleToggle = () => {
        setTransitioning(true);
        setTimeout(() => {
            setActive(!active);
            setTransitioning(false);
        }, 600);
    };

    return (
        <div className={`auth-container ${transitioning ? 'transitioning' : ''}`}>
            {active ? <RegisterForm /> : <LoginForm />}
            <ToggleBox setActive={handleToggle} />
        </div>
    );
};

export default AuthPage;
