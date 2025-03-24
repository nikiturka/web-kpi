import React from "react";

const ToggleBox = ({ setActive }) => {
    return (
        <div className="toggle-box">
            <button className="toggle-btn" onClick={() => setActive(false)}>Login</button>
            <button className="toggle-btn" onClick={() => setActive(true)}>Register</button>
        </div>
    );
};

export default ToggleBox;
