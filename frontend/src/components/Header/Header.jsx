import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Header.css';
import icon from '../../assets/icon.svg';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isAuthPage = location.pathname === '/' ||
        location.pathname === '/login' ||
        location.pathname === '/register';

    if (isAuthPage) return null;

    const handleIconClick = () => {
        navigate('/rooms');
    };

    return (
        <header className="main-header">
            <div className="header-content">
                <img
                    src={icon}
                    alt="User Icon"
                    className="profile-icon"
                    onClick={handleIconClick}
                />

                <nav className="main-nav">
                    <Link
                        to="/rooms"
                        className={`nav-link ${location.pathname.startsWith('/rooms') ? 'active' : ''}`}
                    >
                        Rooms
                    </Link>
                    <Link
                        to="/bookings"
                        className={`nav-link ${location.pathname.startsWith('/bookings') ? 'active' : ''}`}
                    >
                        My Bookings
                    </Link>
                </nav>

                <button
                    className="logout-button"
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/';
                    }}
                >
                    Sign Out
                </button>
            </div>
        </header>
    );
};

export default Header;
