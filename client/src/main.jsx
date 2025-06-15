import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// Импортируем наш провайдер
import { StoreProvider } from "./contexts/StoreProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/*
      Теперь StoreProvider создает экземпляр RootStore
      и делает его доступным для <App /> и всех его дочерних компонентов.
    */}
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
