import { makeAutoObservable, runInAction } from "mobx";
import api from "../api";

export class ProjectStore {
  currentProject = null;
  isLoading = false;

  // Состояние для кода в редакторах
  htmlCode = "";
  cssCode = "";
  jsCode = "";

  // Состояние для результата проверки
  validationResult = null;
  isChecking = false;

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  // Загрузка данных проекта
  async fetchProject(id) {
    this.isLoading = true;
    this.currentProject = null;
    try {
      const response = await api.get(`/projects/${id}`);
      runInAction(() => {
        this.currentProject = response.data;
        // Заполняем редакторы стартовыми шаблонами
        this.htmlCode = response.data.html_template || "";
        this.cssCode = response.data.css_template || "";
        this.jsCode = response.data.js_template || "";
      });
    } catch (error) {
      console.error(`Не удалось загрузить проект ${id}:`, error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // Обновление кода из редакторов
  updateCode(language, value) {
    if (language === "html") this.htmlCode = value;
    if (language === "css") this.cssCode = value;
    if (language === "javascript") this.jsCode = value;
  }

  // Проверка шага
  async checkStep(projectId, stepId) {
    this.isChecking = true;
    this.validationResult = null;
    try {
      const response = await api.post(
        `/projects/${projectId}/steps/${stepId}/check`,
        {
          html: this.htmlCode,
          css: this.cssCode,
          js: this.jsCode,
        }
      );
      runInAction(() => {
        this.validationResult = response.data;
      });
    } catch (error) {
      console.error("Ошибка проверки шага:", error);
      runInAction(() => {
        this.validationResult = {
          success: false,
          errors: ["Ошибка на сервере."],
        };
      });
    } finally {
      runInAction(() => {
        this.isChecking = false;
      });
    }
  }
}
