import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/pages/AuthPage.jsx";
import MainPage from "./components/pages/MainPage.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/main" element={<MainPage />} />

            </Routes>
        </Router>
    );
};

export default App;
