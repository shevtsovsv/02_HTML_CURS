/**
 * @file stores/RootStore.js
 * @description Корневой стор, который объединяет все остальные сторы в приложении.
 */
import { AuthStore } from "./AuthStore";
import { CourseStore } from "./CourseStore";

export class RootStore {
  constructor() {
    // Создаем экземпляр AuthStore и передаем ему ссылку на самого себя (this)
    this.authStore = new AuthStore(this);
    this.courseStore = new CourseStore(this);
  }
}
