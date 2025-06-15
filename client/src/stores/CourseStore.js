/**
 * @file stores/CourseStore.js
 * @description MobX-стор для управления данными курсов.
 */
import { makeAutoObservable, runInAction } from "mobx";
import api from "../api"; // Наш API-клиент

export class CourseStore {
  courses = [];
  isLoading = false;
  rootStore;

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
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
}
