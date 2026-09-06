import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import '../css/ConfirmModal.css';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Delete",
    message = "Are you sure you want to delete this item?",
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "danger" // danger, warning, info
}) => {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>

                <button className="modal-close-btn" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className={`modal-icon ${type}`}>
                    <FaExclamationTriangle />
                </div>

                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>

                <div className="modal-actions">
                    <button
                        className="modal-btn modal-btn-cancel"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`modal-btn modal-btn-${type}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmModal;