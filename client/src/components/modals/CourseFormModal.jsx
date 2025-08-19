/**
 * @file components/modals/CourseFormModal.jsx
 * @description Модальное окно с формой для СОЗДАНИЯ или РЕДАКТИРОВАНИЯ курса.
 */
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import "./Modal.css";

const CourseFormModal = observer(() => {
  const { courseStore } = useStore();

  // Определяем, в каком режиме мы работаем, по наличию `editingCourse`
  const isEditing = !!courseStore.editingCourse;
  const courseToEdit = courseStore.editingCourse;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Этот useEffect будет заполнять форму данными при открытии в режиме редактирования
  useEffect(() => {
    if (isEditing && courseToEdit) {
      setTitle(courseToEdit.title);
      setDescription(courseToEdit.description || "");
    }
  }, [isEditing, courseToEdit]);

  // Если ни одно из модальных окон не должно быть открыто, не рендерим
  if (!courseStore.isCreateModalOpen && !courseStore.isEditModalOpen) {
    return null;
  }

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setError("");
    // Закрываем то модальное окно, которое было открыто
    isEditing ? courseStore.closeEditModal() : courseStore.closeCreateModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isEditing) {
        // Вызываем action для обновления
        await courseStore.updateCourse(courseToEdit.id, { title, description });
      } else {
        // Вызываем action для создания
        await courseStore.createCourse({ title, description });
      }
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || "Произошла ошибка");
    }
  };

  const isLoading = courseStore.isLoadingCreate || courseStore.isLoadingUpdate;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок меняется в зависимости от режима */}
        <h2>{isEditing ? "Редактировать курс" : "Создать новый курс"}</h2>

        <form onSubmit={handleSubmit}>
          {/* ... поля формы без изменений ... */}
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
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading
                ? "Сохранение..."
                : isEditing
                ? "Сохранить изменения"
                : "Создать курс"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default CourseFormModal;
