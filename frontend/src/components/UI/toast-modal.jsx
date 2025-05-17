import React, { useEffect } from "react";
import "../../styles/toast-modal.css";

const ToastModal = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    return (
        <div className="toast-modal">
            {message}
        </div>
    );
};

export default ToastModal;

