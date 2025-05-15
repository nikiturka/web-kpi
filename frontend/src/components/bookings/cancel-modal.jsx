import React from "react";
import Modal from "../UI/modal.jsx";
import "../../styles/cancel-modal.css";

const CancelModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
            <div className="cancel-modal-content">
                <h2>Confirm Cancellation</h2>
                <p>Are you sure you want to cancel this booking?</p>
                <div className="cancel-modal-actions">
                    {isLoading ? (
                        <div className="spinner-container">
                            <div className="spinner" />
                            <span>Deleting...</span>
                        </div>
                    ) : (
                        <>
                            <button className="confirm-btn" onClick={onConfirm}>
                                Yes, Cancel
                            </button>
                            <button className="cancel-btn" onClick={onClose}>
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default CancelModal;
