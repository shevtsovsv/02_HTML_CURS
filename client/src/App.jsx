/**
 * @file App.jsx
 * @description Главный компонент приложения, отвечающий за маршрутизацию.
 */
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "./hooks/useStore";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import CoursePage from "./pages/CoursePage";
import ProtectedRoute from "./components/ProtectedRoute";

// Простой компонент навигации для удобства
// const Navigation = () => {
//   return (
//     <nav
//       style={{ padding: "10px", background: "#f0f0f0", marginBottom: "20px" }}
//     >
//       <Link to="/" style={{ marginRight: "15px" }}>
//         Главная
//       </Link>
//       <Link to="/login">Вход</Link>
//     </nav>
//   );
// };

const Navigation = observer(() => {
  const { authStore } = useStore();
  // Кнопка выхода теперь будет жить здесь
  const handleLogout = () => {
    authStore.logout();
    // После выхода можно ничего не делать, ProtectedRoute сам сделает редирект,
    // если пользователь находился на защищенной странице.
  };
  return (
    <nav
      style={{
        padding: "10px 20px",
        background: "#f0f0f0",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Link to="/" style={{ marginRight: "15px" }}>
          Главная
        </Link>
        {authStore.isAuthenticated && (
          <Link to="/dashboard">Панель управления</Link>
        )}
      </div>
      <div>
        {authStore.isAuthenticated ? (
          // Если пользователь авторизован
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "15px" }}>{authStore.user?.email}</span>
            <button onClick={handleLogout}>Выйти</button>
          </div>
        ) : (
          // Если пользователь - гость
          <Link to="/login">Вход</Link>
        )}
      </div>
    </nav>
  );
});

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

          {/* --- 2. Добавляем новый роут для конкретного курса --- */}
          {/* Он может быть публичным или защищенным. Пока оставим публичным. */}
          {/* :slug - это динамический параметр. React Router передаст его в компонент. */}
          <Route path="/courses/:slug" element={<CoursePage />} />

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
