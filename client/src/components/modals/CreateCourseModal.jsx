/**
 * @file components/modals/CreateCourseModal.jsx
 * @description Модальное окно с формой для создания нового курса.
 */
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import "./Modal.css"; // Общие стили для всех модальных окон

const CreateCourseModal = observer(() => {
  const { courseStore } = useStore();

  // Локальное состояние для полей формы
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Если модальное окно не должно быть открыто, ничего не рендерим
  if (!courseStore.isCreateModalOpen) {
    return null;
  }

  const handleClose = () => {
    // Сбрасываем поля при закрытии
    setTitle("");
    setDescription("");
    setError("");
    courseStore.closeCreateModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Вызываем action из стора для создания курса
      await courseStore.createCourse({ title, description });
      handleClose(); // Закрываем и сбрасываем форму при успехе
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось создать курс");
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Создать новый курс</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="course-title">Название курса</label>
            <input
              id="course-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="course-description">Описание</label>
            <textarea
              id="course-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={courseStore.isLoadingCreate}
              className="btn-primary"
            >
              {courseStore.isLoadingCreate ? "Создание..." : "Создать курс"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default CreateCourseModal;
