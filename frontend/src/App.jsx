import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthContainer from "./components/AuthContainer";
import MainPage from "./components/MainPage";

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
