/**
 * @file components/layout/Navigation.jsx
 * @description Компонент верхней навигационной панели.
 */
import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import "./Layout.css";

const Navigation = observer(() => {
  const { authStore } = useStore();
  const handleLogout = () => {
    authStore.logout();
  };

  return (
    <header className="app-header">
      <div className="header-links">
        <Link to="/">Главная</Link>
        {authStore.isAuthenticated && (
          <Link to="/dashboard">Панель управления</Link>
        )}
      </div>
      <div className="header-user">
        {authStore.isAuthenticated ? (
          <>
            <span>{authStore.user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Выйти
            </button>
          </>
        ) : (
          <Link to="/login">Вход</Link>
        )}
      </div>
    </header>
  );
});

export default Navigation;
