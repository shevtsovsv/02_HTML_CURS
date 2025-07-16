/**
 * @file components/ProtectedRoute.jsx
 * @description Компонент-обертка для защиты роутов.
 */
import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = observer(({ children }) => {
  const { authStore } = useStore();
  const location = useLocation(); // Получаем текущий URL

  if (authStore.isInitializing) {
    // Пока идет самая первая проверка токена, показываем глобальный лоадер
    return <div>Инициализация приложения...</div>;
  }

  if (!authStore.isAuthenticated) {
    // Если пользователь НЕ аутентифицирован:
    // Перенаправляем его на страницу /login.
    // Мы также передаем в `state` текущий URL (location), чтобы после
    // успешного логина можно было вернуть пользователя обратно, откуда он пришел.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если пользователь аутентифицирован, просто рендерим дочерний компонент
  // (ту страницу, которую мы защищаем, например, <DashboardPage />).
  return children;
});

export default ProtectedRoute;
