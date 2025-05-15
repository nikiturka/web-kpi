import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/pages/auth-page.jsx";
import RoomsPage from "./components/pages/rooms-page.jsx";
import BookingsPage from "./components/pages/bookings-page.jsx";
import Header from './components/header/header.jsx';

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