import React, { useEffect, useState, useCallback } from "react";
import BookingCard from "../bookings/booking-card.jsx";
import CancelModal from "../bookings/cancel-modal.jsx";
import "../../styles/bookings-page.css";

const BookingsPage = ({ onShowToast }) => {
    const [userId, setUserId] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                if (decoded?.user_id) {
                    setUserId(decoded.user_id);
                }
            } catch {
                onShowToast?.("Failed to authenticate. Please login again.");
            }
        }
    }, [onShowToast]);

    const fetchBookings = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8000/bookings/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                onShowToast?.(`Failed to fetch bookings: ${response.status}`);
                return;
            }

            const data = await response.json();
            setBookings(data);
            return data;
        } catch {
            onShowToast?.("Failed to load bookings. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [userId, onShowToast]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleRequestCancel = (bookingId) => {
        setSelectedBookingId(bookingId);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        setIsLoading(true);

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

            await new Promise(res => setTimeout(res, 100));

            const updatedResponse = await fetch(`http://localhost:8000/bookings/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (updatedResponse.ok) {
                const updatedBookings = await updatedResponse.json();
                const filteredBookings = updatedBookings.filter(b => b.id !== selectedBookingId);
                setBookings(filteredBookings);
            } else {
                setBookings(prev => prev.filter(b => b.id !== selectedBookingId));
            }

            if (!response.ok) {
                onShowToast?.("Failed to cancel booking.");
            } else {
                onShowToast?.("Booking cancelled successfully.");
            }

            setIsModalOpen(false);
            setSelectedBookingId(null);
        } catch {
            onShowToast?.("Error cancelling booking.");
            setBookings(prev => prev.filter(b => b.id !== selectedBookingId));
            setIsModalOpen(false);
            setSelectedBookingId(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bookings-page">
            <h1>My Bookings</h1>

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
