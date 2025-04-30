import React, { useEffect, useState } from "react";
import Modal from "../UI/Modal";
import "../../styles/SlotModal.css";

const SlotModal = ({ roomId, isOpen, onClose }) => {
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await fetch(`http://localhost:8000/rooms/${roomId}/slots`);
                if (!response.ok) {
                    throw new Error("Failed to fetch slots");
                }
                const data = await response.json();
                setSlots(data);
            } catch (error) {
                console.error("Error fetching slots:", error);
            }
        };

        if (isOpen && roomId) {
            fetchSlots();
        }
    }, [isOpen, roomId]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Доступні слоти</h2>
            {slots.length === 0 ? (
                <p>Немає доступних слотів</p>
            ) : (
                <ul className="slot-list">
                    {slots.map((slot) => (
                        <li key={slot.id}>
                            {new Date(slot.start_time).toLocaleString()} — {new Date(slot.end_time).toLocaleString()}
                        </li>
                    ))}
                </ul>
            )}
        </Modal>
    );
};

export default SlotModal;
