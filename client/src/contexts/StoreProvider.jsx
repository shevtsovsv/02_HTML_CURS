/**
 * @file contexts/StoreProvider.jsx
 * @description Экспортирует компонент-провайдер, который "раздает" стор.
 */
import React from "react";
import { RootStore } from "../stores/RootStore";
import { StoreContext } from "./StoreContext.jsx"; // Импортируем сам контекст

export const StoreProvider = ({ children }) => {
  const store = new RootStore();
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
