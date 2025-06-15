/**
 * @file api/index.js
 * @description Централизованный клиент axios для взаимодействия с бэкенд API.
 */
import axios from "axios";

// Создаем инстанс axios с базовыми настройками
const api = axios.create({
  // Указываем базовый URL нашего API.
  // Теперь во всех запросах не нужно будет писать "http://localhost:5000/api".
  baseURL: "http://localhost:5000/api",
});

/**
 * Перехватчик запросов (Request Interceptor).
 * Эта функция будет вызываться ПЕРЕД КАЖДЫМ запросом, который мы отправляем.
 * Ее задача - проверить, есть ли у нас токен в localStorage, и если есть,
 * автоматически добавить его в заголовок Authorization.
 * Это избавляет нас от необходимости делать это вручную в каждом запросе.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Если токен найден, добавляем заголовок
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Возвращаем измененную конфигурацию, чтобы запрос мог продолжиться
  return config;
});

export default api;
