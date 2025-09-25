/**
 * @file utils/toast.js
 * @description Централизованный сервис для вызова уведомлений.
 */
import { toast } from "react-toastify";

export const toastSuccess = (message) => {
  toast.success(message);
};

export const toastError = (message) => {
  // Проверяем, что сообщение не пустое
  if (message) {
    toast.error(message);
  } else {
    toast.error("Произошла неизвестная ошибка.");
  }
};
