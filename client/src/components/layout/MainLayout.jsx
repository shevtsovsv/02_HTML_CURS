/**
 * @file components/layout/MainLayout.jsx
 * @description Основной шаблон для страниц приложения с хедером.
 */
import React from "react";
import { Outlet } from "react-router-dom"; // Outlet - это место, куда React Router будет вставлять дочерние роуты
import Navigation from "./Navigation"; // Мы вынесем навигацию в отдельный компонент
import "./Layout.css"; // Стили для макета

const MainLayout = () => {
  return (
    <div className="app-container">
      <Navigation />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
