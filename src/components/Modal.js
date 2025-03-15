import React from 'react';
import './Modal.css';

function Modal({ message, onClose, onAction, actionText }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-message">{message}</div>
        <div className="modal-buttons">
          <button className="modal-button close" onClick={onClose}>
            Close
          </button>
          {onAction && (
            <button className="modal-button action" onClick={onAction}>
              {actionText || 'Action'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
