/**
 * @file App.jsx
 * @description Главный компонент приложения, отвечающий за маршрутизацию.
 */
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Простой компонент навигации для удобства
const Navigation = () => {
  return (
    <nav
      style={{ padding: "10px", background: "#f0f0f0", marginBottom: "20px" }}
    >
      <Link to="/" style={{ marginRight: "15px" }}>
        Главная
      </Link>
      <Link to="/login">Вход</Link>
    </nav>
  );
};

function App() {
  return (
    // <Router> - это компонент, который включает всю магию роутинга.
    // Мы оборачиваем в него все наше приложение.
    <Router>
      {/* Добавляем навигацию, чтобы она была на всех страницах */}
      <Navigation />

      <main>
        {/*
          <Routes> - это как switch в программировании. Он смотрит на текущий URL
          и рендерит ПЕРВЫЙ <Route>, который совпадает с этим URL.
        */}
        <Routes>
          {/*
            Когда URL равен "/", будет отрендерен компонент <HomePage />.
            `exact` здесь не нужен, в v6 это поведение по умолчанию.
          */}
          <Route path="/" element={<HomePage />} />

          {/* Когда URL равен "/login", будет отрендерен <LoginPage />. */}
          <Route path="/login" element={<LoginPage />} />

          {/* В будущем здесь будут другие роуты: */}
          <Route
            path="/dashboard"
            element={
              // Оборачиваем нашу страницу в "охранника"
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/projects/:id" element={<ProjectPage />} /> */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
