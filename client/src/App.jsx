// client/src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout"; // Импортируем наш макет
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CoursePage from "./pages/CoursePage";
import ProjectPage from "./pages/ProjectPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectAdminPage from "./pages/ProjectAdminPage";
import ProjectCompletePage from "./pages/ProjectCompletePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // Глобальный обработчик ошибок для подавления ошибок расширений браузера
  useEffect(() => {
    const handleGlobalError = (event) => {
      // Игнорируем ТОЛЬКО специфические ошибки от content scripts и расширений браузера
      if (
        (event.filename && event.filename.includes("content.js")) ||
        (event.filename && event.filename.includes("extension")) ||
        (event.error?.stack && event.error.stack.includes("content.js")) ||
        (event.message &&
          event.message.includes("Invalid value used in weak set"))
      ) {
        console.warn(
          "Игнорируем ошибку от расширения браузера:",
          event.message
        );
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
      // Все остальные ошибки пропускаем для нормальной обработки
    };

    const handleUnhandledRejection = (event) => {
      // Игнорируем отклонения промисов ТОЛЬКО от расширений
      if (
        (event.reason?.stack && event.reason.stack.includes("content.js")) ||
        (event.reason?.message && event.reason.message.includes("WeakSet"))
      ) {
        console.warn(
          "Игнорируем отклонение промиса от расширения:",
          event.reason
        );
        event.preventDefault();
        return false;
      }
      // Все остальные отклонения пропускаем для нормальной обработки
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Роуты, использующие общий макет */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:slug"
            element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Роуты без общего макета (если нужно) */}
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/:id/complete"
          element={
            <ProtectedRoute>
              <ProjectCompletePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectAdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
