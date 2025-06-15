/**
 * @file hooks/useStore.js
 * @description Кастомный хук для легкого доступа к корневому MobX-стору из любого компонента.
 */
import { useContext } from "react";
// Импортируем сам контекст из файла StoreContext.jsx
import { StoreContext } from "../contexts/StoreContext.jsx";

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};
