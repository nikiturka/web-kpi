import React, { useState } from "react";
import LoginForm from "../Authentication/LoginForm.jsx";
import RegisterForm from "../Authentication/RegisterForm.jsx";
import ToggleBox from "../Authentication/ToggleBox.jsx";
import ToastModal from "../UI/ToastModal.jsx";
import "../../styles/AuthComponents.css";

const AuthPage = () => {
    const [active, setActive] = useState(false);
    const [transitioning, setTransitioning] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const handleToggle = () => {
        setTransitioning(true);
        setTimeout(() => {
            setActive(!active);
            setToastMessage(`Switched to ${!active ? "Register" : "Login"}`);
            setTransitioning(false);
        }, 600);
    };

    return (
        <>
            {toastMessage && (
                <ToastModal message={toastMessage} onClose={() => setToastMessage("")} />
            )}

            <div className={`auth-container ${transitioning ? "transitioning" : ""}`}>
                {active ? (
                    <RegisterForm onShowToast={setToastMessage} />
                ) : (
                    <LoginForm onShowToast={setToastMessage} />
                )}

                <ToggleBox setActive={handleToggle} />
            </div>
        </>
    );
};

export default AuthPage;
