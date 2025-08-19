import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";
import CourseCard from "../components/CourseCard";
import "./DashboardPage.css"; // Подключаем стили

const DashboardPage = observer(() => {
  const { authStore, courseStore } = useStore();

  useEffect(() => {
    courseStore.fetchCourses();
  }, [courseStore]);

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
          <button>Создать курс</button>
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
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default DashboardPage;
