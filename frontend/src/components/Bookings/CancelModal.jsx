import React from "react";
import Modal from "../UI/Modal";
import "../../styles/CancelModal.css";

const CancelModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="cancel-modal-content">
                <h2>Підтвердити скасування</h2>
                <p>Ви впевнені, що хочете скасувати це бронювання?</p>
                <div className="cancel-modal-actions">
                    <button className="confirm-btn" onClick={onConfirm}>Так, скасувати</button>
                    <button className="cancel-btn" onClick={onClose}>Відміна</button>
                </div>
            </div>
        </Modal>
    );
};

export default CancelModal;
