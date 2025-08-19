import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";
import CourseCard from "../components/CourseCard";
import "./DashboardPage.css"; // Подключаем стили
import CreateCourseModal from '../components/modals/CourseFormModal'; // <-- 1. Импортируем модальное окно
import CourseFormModal from "../components/modals/CourseFormModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";

const DashboardPage = observer(() => {
  const { authStore, courseStore } = useStore();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    courseStore.fetchCourses();
  }, [courseStore]);

const handleOpenDeleteModal = (course) => {
  setCourseToDelete(course);
  setIsDeleteModalOpen(true);
};
const handleCloseDeleteModal = () => {
  setCourseToDelete(null);
  setIsDeleteModalOpen(false);
};
const handleConfirmDelete = async () => {
  if (courseToDelete) {
    await courseStore.deleteCourse(courseToDelete.id);
    handleCloseDeleteModal();
  }
};


  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Панель управления</h1>
        <p style={{ color: "var(--text-light)" }}>
          Выберите курс, чтобы начать обучение.
        </p>
      </div>

      {/* --- БЛОК КНОПОК ДЛЯ АДМИНА --- */}
      {authStore.isAdmin && (
        <div className="admin-actions" style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => courseStore.openCreateModal()}
            className="btn-primary"
          >
            Создать курс
          </button>
          {/* Кнопки редактирования и удаления лучше размещать на самих карточках */}
        </div>
      )}
      {/* ------------------------------- */}

      {courseStore.isLoading ? (
        <p>Загрузка курсов...</p>
      ) : (
        <div>
          {courseStore.courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isAdmin={authStore.isAdmin}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}
      <CourseFormModal />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Удалить курс?"
        message={`Вы уверены, что хотите удалить курс "${courseToDelete?.title}"? Все связанные с ним проекты и шаги также будут удалены.`}
        isLoading={courseStore.isLoadingDelete}
      />
    </div>
  );
});

export default DashboardPage;
