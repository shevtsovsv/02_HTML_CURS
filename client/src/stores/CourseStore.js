/**
 * @file stores/CourseStore.js
 * @description MobX-стор для управления данными курсов.
 */
import { makeAutoObservable, runInAction } from "mobx";
import api from "../api"; // Наш API-клиент

export class CourseStore {
  courses = [];
  currentCourse = null;
  isLoading = false;
  isCreateModalOpen = false; // Управляет видимостью модального окна
  isLoadingCreate = false; // Отдельный флаг загрузки для процесса создания
  rootStore;

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  // --- 2. НОВЫЕ ACTIONS ДЛЯ УПРАВЛЕНИЯ МОДАЛЬНЫМ ОКНОМ ---
  openCreateModal() {
    this.isCreateModalOpen = true;
  }
  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  // --- 3. НОВЫЙ ACTION ДЛЯ СОЗДАНИЯ КУРСА ---
  async createCourse(courseData) {
    this.isLoadingCreate = true;
    try {
      // Мы используем тот же эндпоинт, что и раньше, он уже готов
      await api.post("/courses", courseData);

      // После успешного создания:
      runInAction(() => {
        this.closeCreateModal(); // Закрываем модальное окно
        // И САМОЕ ГЛАВНОЕ: обновляем список курсов, чтобы увидеть новый
        this.fetchCourses();
      });
    } catch (error) {
      console.error("Ошибка при создании курса:", error);
      // Пробрасываем ошибку, чтобы компонент формы мог ее показать
      throw error;
    } finally {
      runInAction(() => {
        this.isLoadingCreate = false;
      });
    }
  }

  // Action для загрузки всех курсов
  async fetchCourses() {
    this.isLoading = true;
    try {
      const response = await api.get("/courses"); // Запрос на наш бэкенд
      runInAction(() => {
        // Мы используем eager loading на бэке, поэтому курсы придут сразу с проектами
        this.courses = response.data;
      });
    } catch (error) {
      console.error("Не удалось загрузить курсы:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  // --- 2. Добавляем новый action для загрузки одного курса ---
  async fetchCourseBySlug(slug) {
    this.isLoading = true;
    this.currentCourse = null; // Сбрасываем предыдущий курс
    try {
      // Запрос на наш бэкенд, который мы создали ранее
      const response = await api.get(`/courses/${slug}`);
      runInAction(() => {
        this.currentCourse = response.data;
      });
    } catch (error) {
      console.error(`Не удалось загрузить курс ${slug}:`, error);
      // Можно добавить обработку ошибки 404
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}
