/**
 * @file stores/ProjectStore.js
 * @description MobX-стор для управления состоянием ОДНОГО активного проекта.
 */
import { makeAutoObservable, runInAction } from "mobx";
import api from "../api";

export class ProjectStore {
  // --- Состояние (State) ---

  // Хранит полные данные о текущем открытом проекте, включая все шаги и сохраненный код
  currentProject = null;
  isLoading = false; // Показывает, идет ли загрузка данных проекта

  // Эти поля больше не нужны, так как код теперь живет в локальном состоянии компонента Workspace.
  // Но мы их оставим на случай, если они понадобятся для других целей, просто не будем их использовать для сохранения.
  htmlCode = "";
  cssCode = "";
  jsCode = "";

  // Хранит результат последней проверки шага
  validationResult = null;
  isChecking = false; // Показывает, идет ли проверка кода на сервере

  rootStore;

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  // --- Действия (Actions) ---

  /**
   * @action
   * @description Загружает с бэкенда данные по одному проекту, включая все его шаги
   * и ВЕСЬ сохраненный код пользователя для этого проекта.
   * @param {number} id - ID проекта для загрузки.
   */
  async fetchProject(id) {
    this.isLoading = true;
    this.currentProject = null; // Сбрасываем старые данные
    this.validationResult = null; // Сбрасываем результат старой проверки

    try {
      // Запрос на бэкенд, который вернет проект + шаги + массив userCodes
      const response = await api.get(`/projects/${id}`);
      runInAction(() => {
        this.currentProject = response.data;
      });
    } catch (error) {
      console.error(`Не удалось загрузить проект ${id}:`, error);
      // Здесь можно добавить обработку ошибки, например, показ уведомления
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * @action
   * @description Сохраняет код пользователя для КОНКРЕТНОГО ШАГА на бэкенд.
   * @param {number} projectId
   * @param {number} stepId
   * @param {object} code - Объект вида { html, css, js }
   */
  //   async saveCode(projectId, stepId, code) {
  //     if (!this.currentProject || !code) return;

  //     try {
  //       await api.post("/user-code", {
  //         projectId,
  //         stepId, // Передаем ID шага
  //         html: code.html,
  //         css: code.css,
  //         js: code.js,
  //       });

  // 	  runInAction(() => {
  //       // Ищем, есть ли уже сохраненный код для этого шага в нашем локальном массиве
  //       const existingCodeIndex = this.currentProject.userCodes.findIndex(
  //         (c) => c.step_id === stepId
  //       );

  //       const newCodeEntry = {
  //         ...code, // html, css, js
  //         step_id: stepId,
  //         project_id: projectId,
  //         user_id: this.rootStore.authStore.user.id, // предполагаем, что id юзера есть в authStore
  //       };

  //       if (existingCodeIndex > -1) {
  //         // Если есть - обновляем его
  //         this.currentProject.userCodes[existingCodeIndex] = newCodeEntry;
  //       } else {
  //         // Если нет - добавляем в массив
  //         this.currentProject.userCodes.push(newCodeEntry);
  //       }
  //     });
  //       console.log(`Код для шага ${stepId} успешно сохранен.`);
  //     } catch (error) {
  //       console.error("Не удалось сохранить прогресс:", error);
  //     }
  //   }

  /**
   * @action
   * @description Сохраняет код и СИНХРОНИЗИРУЕТ локальное состояние.
   */
  async saveCode(projectId, stepId, code) {
    if (!this.currentProject || !code) return;

    try {
      // 1. Отправляем запрос на сохранение в БД
      await api.post("/user-code", {
        projectId,
        stepId,
        html: code.html,
        css: code.css,
        js: code.js,
      });

      console.log(`Код для шага ${stepId} успешно сохранен на сервере.`);

      // --- 2. ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ: Обновляем состояние в памяти фронтенда ---
      runInAction(() => {
        if (!this.currentProject.userCodes) {
          this.currentProject.userCodes = []; // На случай, если массив не существовал
        }

        const existingCodeIndex = this.currentProject.userCodes.findIndex(
          (c) => c.step_id === stepId
        );

        // Создаем новую запись с данными
        const newCodeEntry = {
          ...code, // html, css, js
          step_id: stepId,
          project_id: projectId,
        };

        if (existingCodeIndex > -1) {
          // Если запись для этого шага уже была - обновляем ее
          this.currentProject.userCodes[existingCodeIndex] = newCodeEntry;
        } else {
          // Если нет - добавляем новую
          this.currentProject.userCodes.push(newCodeEntry);
        }
      });
      // ----------------------------------------------------------------
    } catch (error) {
      console.error("Не удалось сохранить прогресс:", error);
    }
  }

  /**
   * @action
   * @description Отправляет текущий код на проверку для конкретного шага.
   * @param {number} projectId
   * @param {number} stepId
   * @param {object} code - Объект с кодом { html, css, js }
   */
  async checkStep(projectId, stepId, code) {
    this.isChecking = true;
    this.validationResult = null;
    try {
      const response = await api.post(
        `/projects/${projectId}/steps/${stepId}/check`,
        {
          html: code.html,
          css: code.css,
          js: code.js,
        }
      );
      runInAction(() => {
        this.validationResult = response.data;
        // TODO: Если success: true, сохранить прогресс в userProgress
      });
    } catch (error) {
      console.error("Ошибка проверки шага:", error);
      runInAction(() => {
        this.validationResult = {
          success: false,
          errors: ["Ошибка на сервере при проверке."],
        };
      });
    } finally {
      runInAction(() => {
        this.isChecking = false;
      });
    }
  }

  // Этот метод больше не нужен, так как код теперь живет в локальном состоянии компонента,
  // который знает о языке. Но можно оставить на будущее.
  updateCode(language, value) {
    if (language === "html") this.htmlCode = value;
    if (language === "css") this.cssCode = value;
    if (language === "javascript") this.jsCode = value;
  }
  async markStepAsCompleted(projectId, stepId) {
    try {
      await api.post("/progress/complete-step", { projectId, stepId });
      console.log(`Прогресс для шага ${stepId} сохранен на сервере.`);
    } catch (error) {
      console.error("Не удалось сохранить прогресс шага:", error);
    }
  }

  /**
   * @action
   * @description Сбрасывает результат последней проверки.
   */
  resetValidationResult() {
    this.validationResult = null;
  }
}
