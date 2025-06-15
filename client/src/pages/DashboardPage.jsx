/**
 * @file pages/DashboardPage.jsx
 * @description Страница панели управления, доступная только авторизованным пользователям.
 */
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom"; // Хук для редиректа

const DashboardPage = observer(() => {
  const { authStore, courseStore } = useStore();
  const navigate = useNavigate();

  // Проверяем, есть ли данные о пользователе. Если стор еще не загрузил их,
  // можно показать заглушку или просто ничего не рендерить.
  if (!authStore.user) {
    // Такое может произойти при первой загрузке страницы, если данные еще не подтянулись.
    // В будущем мы добавим сюда загрузку профиля пользователя.
    return <div>Загрузка данных пользователя...</div>;
  }

  useEffect(() => {
    // Запускаем загрузку курсов, когда компонент монтируется
    courseStore.fetchCourses();
  }, [courseStore]); // [courseStore] - массив зависимостей. Эффект перезапустится, если courseStore изменится (что бывает редко).

  // Функция для обработки выхода
  const handleLogout = () => {
    authStore.logout();
    // После выхода перенаправляем пользователя на страницу логина
    navigate("/login");
  };

  return (
    <div>
      <h1>Панель управления</h1>
      <h2>Добро пожаловать, {authStore.user.email}!</h2>
      <p>
        Это защищенная страница. Вы видите ее, потому что вы успешно вошли в
        систему.
      </p>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          background: "#dc3545",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Выйти
      </button>
      <hr />

      <h2>Доступные курсы</h2>
      {courseStore.isLoading ? (
        <p>Загрузка курсов...</p>
      ) : (
        <div>
          {courseStore.courses.map((course) => (
            // Используем наш новый красивый компонент
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
});

export default DashboardPage;
