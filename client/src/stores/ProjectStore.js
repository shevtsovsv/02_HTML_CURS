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
  async saveCode(projectId, stepId, code) {
    if (!this.currentProject || !code) return;

    try {
      await api.post("/user-code", {
        projectId,
        stepId, // Передаем ID шага
        html: code.html,
        css: code.css,
        js: code.js,
      });
      console.log(`Код для шага ${stepId} успешно сохранен.`);
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
}

// import { makeAutoObservable, runInAction } from "mobx";
// import api from "../api";

// export class ProjectStore {
//   currentProject = null;
//   isLoading = false;

//   // Состояние для кода в редакторах
//   htmlCode = "";
//   cssCode = "";
//   jsCode = "";

//   // Состояние для результата проверки
//   validationResult = null;
//   isChecking = false;

//   constructor(rootStore) {
//     makeAutoObservable(this);
//     this.rootStore = rootStore;
//   }

//   // Загрузка данных проекта
//   //   async fetchProject(id) {
//   //     this.isLoading = true;
//   //     this.currentProject = null;
//   //     try {
//   //       const response = await api.get(`/projects/${id}`);
//   //       runInAction(() => {
//   //         this.currentProject = response.data;
//   //         const savedCode = response.data.userCodes?.[0]; // Получаем сохраненный код
//   //         console.log("currentProject", this.currentProject.userCodes[0].html);

//   //         // Если есть сохраненный код, используем его.
//   //         // Иначе - берем стартовые шаблоны из проекта.
//   //         this.htmlCode = savedCode?.html ?? response.data.html_template ?? "";
//   //         this.cssCode = savedCode?.css ?? response.data.css_template ?? "";
//   //         this.jsCode = savedCode?.js ?? response.data.js_template ?? "";
//   //       });
//   //     } catch (error) {
//   //       console.error(`Не удалось загрузить проект ${id}:`, error);
//   //     } finally {
//   //       runInAction(() => {
//   //         this.isLoading = false;
//   //       });
//   //     }
//   //   }

//   // Обновление кода из редакторов

//   // --- ИЗМЕНЕНИЕ: Логика инициализации кода переехала в компонент. ---
//   // fetchProject теперь только загружает данные.
//   async fetchProject(id) {
//     this.isLoading = true;
//     this.currentProject = null;
//     this.validationResult = null;
//     try {
//       const response = await api.get(`/projects/${id}`);
//       runInAction(() => {
//         this.currentProject = response.data;
//         // --- ИЗМЕНЕНИЕ: Мы больше не устанавливаем htmlCode и т.д. здесь.
//         // Этим займется компонент Workspace, когда получит project.
//         // Это более правильное разделение ответственности.
//       });
//     } catch (error) {
//       console.error(`Не удалось загрузить проект ${id}:`, error);
//     } finally {
//       runInAction(() => {
//         this.isLoading = false;
//       });
//     }
//   }

//   updateCode(language, value) {
//     if (language === "html") this.htmlCode = value;
//     if (language === "css") this.cssCode = value;
//     if (language === "javascript") this.jsCode = value;
//   }

//   async checkAndProceed(stepId) {

//     if (!this.currentProject || !stepId) {
//       console.error("Невозможно проверить шаг: нет проекта или ID шага.");
//       return;
//     }

//     this.isChecking = true;
//     this.validationResult = null;

//     const projectId = this.currentProject.id;

//     try {
//       // Отправляем запрос с ID проекта и ID шага
//       const response = await api.post(
//         `/projects/${projectId}/steps/${stepId}/check`,
//         {
//           html: this.htmlCode,
//           css: this.cssCode,
//           js: this.jsCode,
//         }
//       );

//       runInAction(() => {
//         this.validationResult = response.data; // Сохраняем результат проверки

//       });
//     } catch (error) {
//       console.error("Ошибка проверки шага:", error);
//       runInAction(() => {
//         // Отображаем ошибку пользователю
//         this.validationResult = {
//           success: false,
//           errors: ["Не удалось связаться с сервером. Попробуйте снова."],
//         };
//       });
//     } finally {
//       runInAction(() => {
//         this.isChecking = false;
//       });
//     }
//   }
// }
