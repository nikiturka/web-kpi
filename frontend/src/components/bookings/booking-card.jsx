import React from "react";
import { dateFormatter, timeFormatter } from "../../utils/date-formatters.jsx";
import "../../styles/booking-card.css";

const BookingCard = ({ booking, onCancel }) => {
    const start = new Date(booking.start_time);
    const end = new Date(booking.end_time);

    return (
        <div className="booking-card" onClick={() => {}}>
            <h3>Room ID: {booking.room_id}</h3>
            <p>Start: {`${dateFormatter.format(start)} ${timeFormatter.format(start)}`}</p>
            <p>End: {`${dateFormatter.format(end)} ${timeFormatter.format(end)}`}</p>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onCancel(booking.id);
                }}
            >
                Cancel
            </button>
        </div>
    );
};

export default BookingCard;
