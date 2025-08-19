/**
 * @file components/modals/ConfirmDeleteModal.jsx
 * @description Универсальное модальное окно для подтверждения удаления.
 */
import React from "react";
import "./Modal.css";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title || "Подтвердите удаление"}</h2>
        <p>
          {message ||
            "Вы уверены, что хотите удалить этот элемент? Это действие необратимо."}
        </p>

        <div className="modal-actions">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger"
            disabled={isLoading}
          >
            {isLoading ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
