import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/pages/auth-page.jsx";
import RoomsPage from "./components/pages/rooms-page.jsx";
import BookingsPage from "./components/pages/bookings-page.jsx";
import Header from './components/header/header.jsx';
import PrivateRoute from './components/routes/private-route.jsx';
import { AuthProvider } from './components/context/auth-context.jsx';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/rooms" element={<PrivateRoute element={<RoomsPage />} />} />
                    <Route path="/bookings" element={<PrivateRoute element={<BookingsPage />} />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};


export default App;
