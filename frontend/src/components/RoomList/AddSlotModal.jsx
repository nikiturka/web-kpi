import React, { useState } from "react";
import Modal from "../UI/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/AddSlotModal.css";

const AddSlotModal = ({
                          roomId,
                          isOpen,
                          onClose,
                          onSuccess,
                          onShowToast,
                          hasDuplicateSlot
                      }) => {
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddSlot = async () => {
        if (!startTime || !endTime) {
            onShowToast?.("Please select both start and end times");
            return;
        }

        if (endTime <= startTime) {
            onShowToast?.("End time must be after start time");
            return;
        }

        if (hasDuplicateSlot(startTime, endTime)) {
            onShowToast?.("This time slot overlaps with an existing one");
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem("token");
        if (!token) {
            onShowToast?.("Authorization token is missing");
            setIsSubmitting(false);
            return;
        }

        const payload = {
            room_id: roomId,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString()
        };

        try {
            const response = await fetch(`http://localhost:8000/rooms/${roomId}/slots`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                onShowToast?.(errorData.detail || "Failed to create slot");
                setIsSubmitting(false);
                return;
            }

            const newSlot = await response.json();
            onShowToast?.("Slot added successfully!");
            onSuccess(newSlot);
            setStartTime(null);
            setEndTime(null);
            onClose();
        } catch (error) {
            onShowToast?.("Error adding slot: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="add-slot-modal-content">
                <h2>Add Slot</h2>
                <div className="slot-inputs">
                    <DatePicker
                        selected={startTime}
                        onChange={setStartTime}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd HH:mm"
                        placeholderText="Start Time"
                        className="date-picker-input"
                    />
                    <DatePicker
                        selected={endTime}
                        onChange={setEndTime}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd HH:mm"
                        placeholderText="End Time"
                        className="date-picker-input"
                    />
                </div>
                <button
                    className="confirm-button"
                    onClick={handleAddSlot}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Adding..." : "Add Slot"}
                </button>
            </div>
        </Modal>
    );
};

export default AddSlotModal;
