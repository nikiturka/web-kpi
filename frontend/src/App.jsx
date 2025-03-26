import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthContainer from "./components/authentication/AuthContainer.jsx";
import MainPage from "./components/MainPage.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthContainer />} />
                <Route path="/main" element={<MainPage />} />
            </Routes>
        </Router>
    );
};

export default App;
