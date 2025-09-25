/**
 * @file pages/LoginPage.jsx
 * @description Компонент-страница для входа пользователя в систему.
 */
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore.js";
import { useNavigate } from "react-router-dom";
import { toastError } from "../utils/toast";
// useNavigate - это хук из react-router-dom для программного редиректа.
// Мы установим react-router-dom на следующем шаге.
// import { useNavigate } from 'react-router-dom';

// `observer` - это функция-обертка от MobX, которая делает компонент
// "реактивным". Он будет автоматически перерисовываться при изменении
// наблюдаемых свойств в сторе (например, authStore.isLoading).
const LoginPage = observer(() => {
  // Получаем доступ к нашему authStore через хук useStore
  const { authStore } = useStore();
  const navigate = useNavigate(); // Раскомментируем, когда настроим роутинг

  // Локальное состояние компонента для полей ввода и ошибок
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async (e) => {
    // Предотвращаем стандартное поведение формы (перезагрузку страницы)
    e.preventDefault();

    try {
      // Вызываем action `login` из нашего стора
      await authStore.login(email, password);

      // Если логин прошел успешно (иначе бы вылетела ошибка),
      // можно выполнить редирект.
      console.log("Успешный вход!");
      navigate("/dashboard"); // Пример редиректа на главную панель
    } catch (err) {
      // Если authStore.login выбросил ошибку, мы ее ловим
      // и устанавливаем сообщение для пользователя.
      toastError(err.response?.data?.error || "Произошла неизвестная ошибка");
    }
  };

  // Простой JSX для формы.
  // Можно добавить стили через CSS-файлы или CSS-in-JS.
  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h1>Вход в систему</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Пароль:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button
          type="submit"
          disabled={authStore.isLoading} // Кнопка неактивна во время запроса
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {authStore.isLoading ? "Выполняется вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
});

export default LoginPage;
