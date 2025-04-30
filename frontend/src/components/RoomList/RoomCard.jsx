import React from "react";
import "../../styles/RoomCard.css";

const RoomCard = ({ room, onViewSlots }) => {
    return (
        <div className="room-card">
            <h3>{room.name}</h3>
            <p>Локація: {room.location}</p>
            <p>Тип: {room.type}</p>
            {/* Якщо буде місто окремо — сюди додати */}
            <button onClick={() => onViewSlots(room.id)}>Переглянути слоти</button>
        </div>
    );
};

export default RoomCard;
