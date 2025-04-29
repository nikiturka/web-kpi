import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/pages/AuthPage.jsx";
import RoomsPage from "./components/pages/RoomsPage.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/rooms" element={<RoomsPage />} />

            </Routes>
        </Router>
    );
};

export default App;
