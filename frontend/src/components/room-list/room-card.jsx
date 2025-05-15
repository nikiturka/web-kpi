import React from "react";
import "../../styles/room-card.css";

const formatRoomType = (type) => {
    const typeMap = {
        meeting: "Meeting Room",
        workspace: "Workspace",
        conference_hall: "Conference Hall",
        lounge: "Lounge Area",
        training_room: "Training Room",
    };
    return typeMap[type] || type;
};

const RoomCard = ({ room, onViewSlots }) => {
    return (
        <div className="room-card">
            <h3>{room.name}</h3>
            <p>Location: {room.location}</p>
            <p>Type: {formatRoomType(room.type)}</p>
            <button onClick={() => onViewSlots(room.id)}>Show slots</button>
        </div>
    );
};

export default RoomCard;
