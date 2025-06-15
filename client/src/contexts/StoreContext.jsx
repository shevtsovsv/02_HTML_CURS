/**
 * @file contexts/StoreContext.jsx
 * @description Настройка и экспорт React Context и провайдера для MobX-стора.
 */
import React, { createContext } from "react";

// 1. Создаем и сразу экспортируем React Context.
// Он понадобится нашему хуку useStore.
export const StoreContext = createContext(null);
