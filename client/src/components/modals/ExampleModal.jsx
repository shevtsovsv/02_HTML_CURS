/**
 * @file components/modals/ExampleModal.jsx
 * @description Модальное окно для отображения изображения-примера.
 */
import React, { useState } from "react";
import "./Modal.css"; // Используем те же стили, что и для других модалок

const ExampleModal = ({ isOpen, onClose, imageUrl, title }) => {
	 const [viewMode, setViewMode] = useState("fitHeight");

const styles = {
  // --- РЕЖИМ "ПО ВЫСОТЕ" (по умолчанию) ---
  fitHeight: {
    // Контейнер просто центрирует картинку
    container: {
      textAlign: "center",
    },
    // Картинка ограничена по высоте и ширине
    image: {
      maxWidth: "100%",
      maxHeight: "80vh", // Ограничиваем высоту, чтобы она помещалась на экране
      display: "block",
      margin: "auto",
    },
  },
  // --- РЕЖИM "ПО ШИРИНЕ" (со скроллом) ---
  fitWidth: {
    // Контейнер получает максимальную высоту и вертикальный скролл
    container: {
      maxHeight: "80vh",
      overflowY: "auto", // <-- Ключевое свойство для скроллинга!
    },
    // Картинка растягивается на 100% ширины контейнера
    image: {
      width: "100%",
      height: "auto", // Высота подстраивается автоматически для сохранения пропорций
      display: "block",
    },
  },
};

const toggleViewMode = () => {
  setViewMode((currentMode) =>
    currentMode === "fitHeight" ? "fitWidth" : "fitHeight"
  );
};
	 
  if (!isOpen) {
    return null;
  }

  return (
    // При клике на фон модальное окно закрывается
    <div className="modal-backdrop" onClick={onClose}>
      {/* e.stopPropagation() предотвращает закрытие окна при клике на сам контент */}
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "80vw", padding: "1rem" }}
      >
        <h3 style={{ marginTop: 0, textAlign: "center" }}>
          Пример выполнения: {title}
        </h3>
        <div style={styles[viewMode].container}>
          <img
            src={imageUrl}
            alt={`Пример для ${title}`}
            style={styles[viewMode].image}
          />
        </div>
        <div className="modal-actions" style={{ justifyContent: "center" }}>
          <button onClick={toggleViewMode} className="btn-secondary">
            {/* Показываем текст, описывающий ДРУГОЙ режим */}
            {viewMode === "fitHeight"
              ? "Показать по ширине"
              : "Показать по высоте"}
          </button>
          <button onClick={onClose} className="btn-primary">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExampleModal;
