import React, { useEffect, useState } from "react";
import BookingCard from "../Bookings/BookingCard";
import CancelModal from "../Bookings/CancelModal";
import "../../styles/BookingsPage.css";

const BookingsPage = () => {
    const [userId, setUserId] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                if (decoded?.user_id) {
                    setUserId(decoded.user_id);
                }
            } catch (err) {
                console.error("Failed to decode token:", err);
                setError("Failed to authenticate. Please login again.");
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchBookings();
        }
    }, [userId]);

    const fetchBookings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8000/bookings/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch bookings: ${response.status}`);
            }

            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setError("Failed to load bookings. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestCancel = (bookingId) => {
        setSelectedBookingId(bookingId);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:8000/bookings/${selectedBookingId}`,
                {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to cancel booking: ${response.status}`);
            }

            await fetchBookings();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error cancelling booking:", error);
            setError("Failed to cancel booking. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bookings-page">
            <h1>My Bookings</h1>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={fetchBookings}>Retry</button>
                </div>
            )}

            {isLoading && bookings.length === 0 ? (
                <div className="loading-spinner">Loading...</div>
            ) : bookings.length === 0 ? (
                <p className="no-bookings">No active bookings found</p>
            ) : (
                <div className="booking-list">
                    {bookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onCancel={handleRequestCancel}
                            isCanceling={isLoading && selectedBookingId === booking.id}
                        />
                    ))}
                </div>
            )}

            <CancelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmCancel}
                isLoading={isLoading}
            />
        </div>
    );
};

export default BookingsPage;