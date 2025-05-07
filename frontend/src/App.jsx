import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/pages/AuthPage.jsx";
import RoomsPage from "./components/pages/RoomsPage.jsx";
import BookingsPage from "./components/pages/BookingsPage.jsx";
import Header from './components/Header/Header';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
            </Routes>
        </Router>
    );
};

export default App;