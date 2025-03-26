import React, { useState } from "react";
import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";
import ToggleBox from "./ToggleBox.jsx";
import "../../styles/auth.css";

const AuthContainer = () => {
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

export default AuthContainer;
