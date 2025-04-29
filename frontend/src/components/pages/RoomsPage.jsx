import React, { useEffect, useState } from "react";
import RoomCard from "../RoomList/RoomCard";
import SlotModal from "../RoomList/SlotModal";
import "../../styles/RoomsPage.css";

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState("");  // Фільтр типу кімнати

    // Функція для отримання кімнат із серверу
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
            setRooms(data); // Оновлюємо список кімнат
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    // Оновлюємо кімнати при зміні фільтра
    useEffect(() => {
        fetchRooms(filterType);
    }, [filterType]);

    const handleViewSlots = (roomId) => {
        setSelectedRoomId(roomId);
        setIsModalOpen(true);
    };

    return (
        <div className="rooms-page">
            <h1>Доступні кімнати</h1>

            {/* Фільтр типу кімнати */}
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">Усі кімнати</option>
                <option value="meeting">Переговорна кімната</option>
                <option value="workspace">Робоче місце</option>
                <option value="conference_hall">Конференц-зал</option>
                <option value="lounge">Лаунж-зона</option>
                <option value="training_room">Тренінгова кімната</option>
            </select>

            <div className="room-list">
                {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} onViewSlots={handleViewSlots} />
                ))}
            </div>

            {/* Модальне вікно для перегляду слотів */}
            <SlotModal
                roomId={selectedRoomId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default RoomsPage;
