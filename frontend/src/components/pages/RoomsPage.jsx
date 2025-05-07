import React, { useEffect, useState } from "react";
import RoomCard from "../RoomList/RoomCard";
import SlotModal from "../RoomList/SlotModal";
import ToastModal from "../UI/ToastModal";
import "../../styles/RoomsPage.css";

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const fetchRooms = async (type = "") => {
        try {
            let url = "http://127.0.0.1:8000/rooms/";

            if (type) {
                url += `?room_type=${type}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch rooms");
            }

            const data = await response.json();
            setRooms(data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    useEffect(() => {
        fetchRooms(filterType);
    }, [filterType]);

    const handleViewSlots = (roomId) => {
        // When the "View Slots" button is clicked, set the selected room ID and open the modal
        setSelectedRoomId(roomId);
        setIsModalOpen(true);
    };

    return (
        <div className="rooms-page">
            <h1>Available Rooms</h1>

            <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="room-filter"
            >
                <option value="">All rooms</option>
                <option value="meeting">Meeting Room</option>
                <option value="workspace">Workspace</option>
                <option value="conference_hall">Conference Hall</option>
                <option value="lounge">Lounge Area</option>
                <option value="training_room">Training Room</option>
            </select>

            <div className="room-list">
                {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} onViewSlots={handleViewSlots} />
                ))}
            </div>

            <SlotModal
                roomId={selectedRoomId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onShowToast={(msg) => setToastMessage(msg)}
            />

            {toastMessage && (
                <ToastModal message={toastMessage} onClose={() => setToastMessage("")} />
            )}
        </div>
    );
};

export default RoomsPage;
