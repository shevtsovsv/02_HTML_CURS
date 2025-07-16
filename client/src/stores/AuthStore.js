/**
 * @file stores/AuthStore.js
 * @description MobX-стор для управления состоянием аутентификации.
 * Хранит данные о пользователе, токене и предоставляет методы для логина/логаута.
 */
import { makeAutoObservable, runInAction } from "mobx";
import api from "../api"; // Наш настроенный axios-клиент

export class AuthStore {
  // --- Состояние (State) ---

  /**
   * @property {object|null} user - Данные авторизованного пользователя.
   */
  user = null;

  /**
   * @property {string|null} token - JWT-токен.
   * При инициализации пытаемся загрузить его из localStorage.
   */
  token = localStorage.getItem("token") || null;

  /**
   * @property {boolean} isLoading - Флаг для отслеживания процесса загрузки (логина).
   * Полезен для отображения спиннеров или блокировки кнопок.
   */
  isLoading = false;

  // Флаг первоначальной загрузки ---
  isInitializing = true;

  /**
   * @property {object} rootStore - Ссылка на корневой стор, если понадобится взаимодействие.
   */
  rootStore;

  constructor(rootStore) {
    // makeAutoObservable автоматически делает свойства наблюдаемыми,
    // а методы - действиями (actions).
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.fetchCurrentUser();
  }

  // --- Вычисляемые свойства (Computed Properties) ---

  /**
   * @computed
   * @returns {boolean} - Возвращает true, если пользователь аутентифицирован (есть токен).
   */
  get isAuthenticated() {
    return !!this.token;
  }

  // --- Действия (Actions) ---

  async fetchCurrentUser() {
    if (!this.token) {
      // Если токена нет, просто завершаем инициализацию
      this.isInitializing = false;
      return;
    }

    try {
      const response = await api.get("/user/me");
      runInAction(() => {
        this.user = response.data;
      });
    } catch (error) {
      // Если токен невалидный, сервер вернет 401. Ловим ошибку и выходим.
      console.error('Ошибка "тихого" входа:', error);
      this.logout(); // Очищаем плохой токен
    } finally {
      runInAction(() => {
        this.isInitializing = false; // Инициализация завершена в любом случае
      });
    }
  }

  /**
   * @action
   * @description Выполняет логин пользователя.
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    this.isLoading = true;
    try {
      // Отправляем запрос на наш бэкенд с помощью централизованного клиента
      const response = await api.post("/auth/login", { email, password });

      // `runInAction` используется для безопасного изменения состояния
      // после асинхронной операции (await).
      runInAction(() => {
        this.user = response.data.user;
        this.token = response.data.token;

        // Сохраняем токен в localStorage, чтобы сессия сохранялась
        // после перезагрузки страницы.
        localStorage.setItem("token", this.token);
      });
    } catch (error) {
      // Выводим ошибку в консоль для отладки
      console.error(
        "Ошибка при логине:",
        error.response?.data?.error || error.message
      );
      // Пробрасываем ошибку дальше, чтобы компонент мог ее поймать и показать пользователю.
      throw error;
    } finally {
      // Вне зависимости от успеха или ошибки, выключаем флаг загрузки.
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * @action
   * @description Выполняет выход пользователя из системы.
   */
  logout() {
    this.user = null;
    this.token = null;
    // Очищаем токен из localStorage
    localStorage.removeItem("token");
    // Можно добавить редирект на главную страницу, но это лучше делать в компоненте
  }
}
