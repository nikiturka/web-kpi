import React, { useState } from "react";
import LoginForm from "../authentication/login-form.jsx";
import RegisterForm from "../authentication/register-form.jsx";
import ToggleBox from "../authentication/toggle-box.jsx";
import ToastModal from "../UI/toast-modal.jsx";
import "../../styles/global.css";
import "../../styles/auth-page.css";

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
