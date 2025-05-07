import React from "react";
import "../../styles/BookingCard.css";

const BookingCard = ({ booking, onCancel }) => {
    return (
        <div className="booking-card">
            <h3>Кімната ID: {booking.room_id}</h3>
            <p>Початок: {new Date(booking.start_time).toLocaleString()}</p>
            <p>Кінець: {new Date(booking.end_time).toLocaleString()}</p>
            <button onClick={() => onCancel(booking.id)}>Скасувати</button>
        </div>
    );
};

export default BookingCard;
