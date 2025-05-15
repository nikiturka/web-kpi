import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../UI/modal.jsx";
import AddSlotModal from "./add-slot-modal.jsx";
import { dateFormatter, timeFormatter } from "../../utils/date-formatters.jsx";
import "../../styles/slot-modal.css";

const SlotModal = ({ roomId, isOpen, onClose, onShowToast }) => {
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const fetchSlots = async () => {
        try {
            const response = await fetch(`http://localhost:8000/rooms/${roomId}/slots`);
            if (!response.ok) {
                throw new Error("Failed to fetch slots");
            }
            const data = await response.json();
            const sortedSlots = data.sort((a, b) =>
                new Date(a.start_time) - new Date(b.start_time)
            );
            setSlots(sortedSlots);
        } catch {
            onShowToast?.("Error loading available slots. Please try again later.");
        }
    };

    const hasDuplicateSlot = (newStartTime, newEndTime) => {
        return slots.some(slot => {
            const existingStart = new Date(slot.start_time).getTime();
            const existingEnd = new Date(slot.end_time).getTime();
            const newStart = new Date(newStartTime).getTime();
            const newEnd = new Date(newEndTime).getTime();

            return (
                (newStart >= existingStart && newStart < existingEnd) ||
                (newEnd > existingStart && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd)
            );
        });
    };

    useEffect(() => {
        const checkIfAdmin = () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setIsAdmin(decoded?.role === "admin");
            } catch {
                console.error("Failed to decode token");
            }
        };

        if (isOpen && roomId) {
            fetchSlots();
            setSelectedSlot(null);
            checkIfAdmin();
        }
    }, [isOpen, roomId]);

    const handleSlotAdded = (newSlot) => {
        setSlots(prevSlots => {
            const updatedSlots = [...prevSlots, newSlot];
            return updatedSlots.sort((a, b) =>
                new Date(a.start_time) - new Date(b.start_time)
            );
        });
        setIsAddSlotOpen(false);
        onShowToast?.("Slot successfully added.");
    };

    const handleConfirmBooking = async () => {
        if (!selectedSlot) return;

        const token = localStorage.getItem("token");
        if (!token) {
            onShowToast?.("Authorization token missing");
            return;
        }

        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            if (decodedToken.exp * 1000 < Date.now()) {
                onShowToast?.("Your session has expired. Please login again.");
                return;
            }
        } catch {
            onShowToast?.("Invalid token format");
            return;
        }

        const payload = {
            room_id: roomId,
            start_time: new Date(selectedSlot.start_time).toISOString(),
            end_time: new Date(selectedSlot.end_time).toISOString()
        };

        try {
            const response = await fetch("http://localhost:8000/bookings/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                const message = errorData.detail || "Failed to create booking";
                onShowToast?.(`Booking error: ${message}`);
                return;
            }

            onShowToast?.("Booking successful!");
            onClose();
            navigate("/bookings");
        } catch (error) {
            onShowToast?.(`Booking error: ${error.message}`);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="modal-scroll-content">
                    <h2>Available slots</h2>
                    {slots.length === 0 ? (
                        <p>No available slots</p>
                    ) : (
                        <ul className="slot-list">
                            {slots.map((slot) => {
                                const isSelected = selectedSlot && selectedSlot.id === slot.id;
                                const startTime = new Date(slot.start_time);
                                const endTime = new Date(slot.end_time);

                                return (
                                    <li
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={isSelected ? "selected" : ""}
                                    >
                                        {`${dateFormatter.format(startTime)} ${timeFormatter.format(startTime)} — ${timeFormatter.format(endTime)}`}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="slot-modal-footer">
                    <button
                        className="confirm-button"
                        onClick={handleConfirmBooking}
                        disabled={!selectedSlot}
                    >
                        Confirm booking
                    </button>

                    {isAdmin && (
                        <button
                            className="add-slot-button"
                            onClick={() => setIsAddSlotOpen(true)}
                        >
                            + Add slot
                        </button>
                    )}
                </div>
            </Modal>

            <AddSlotModal
                isOpen={isAddSlotOpen}
                onClose={() => setIsAddSlotOpen(false)}
                roomId={roomId}
                onSuccess={handleSlotAdded}
                onShowToast={onShowToast}
                existingSlots={slots}
                hasDuplicateSlot={hasDuplicateSlot}
            />
        </>
    );
};

export default SlotModal;
