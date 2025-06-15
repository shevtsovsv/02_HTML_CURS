/**
 * @file pages/DashboardPage.jsx
 * @description Страница панели управления, доступная только авторизованным пользователям.
 */
import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";
import { useNavigate } from "react-router-dom"; // Хук для редиректа

const DashboardPage = observer(() => {
  const { authStore } = useStore();
  const navigate = useNavigate();

  // Проверяем, есть ли данные о пользователе. Если стор еще не загрузил их,
  // можно показать заглушку или просто ничего не рендерить.
  if (!authStore.user) {
    // Такое может произойти при первой загрузке страницы, если данные еще не подтянулись.
    // В будущем мы добавим сюда загрузку профиля пользователя.
    return <div>Загрузка данных пользователя...</div>;
  }

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
    </div>
  );
});

export default DashboardPage;
