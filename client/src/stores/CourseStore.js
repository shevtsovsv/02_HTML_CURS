/**
 * @file stores/CourseStore.js
 * @description MobX-стор для управления данными курсов.
 */
import { makeAutoObservable, runInAction } from "mobx";
import api from "../api";
import { toastSuccess, toastError } from "../utils/toast"; // <-- Убедитесь, что импорт есть

export class CourseStore {
  // ... все ваши свойства остаются без изменений ...
  courses = [];
  currentCourse = null;
  isLoading = false;
  isCreateModalOpen = false;
  isLoadingCreate = false;
  isEditModalOpen = false;
  editingCourse = null;
  isLoadingUpdate = false;
  isLoadingDelete = false;
  isProjectCreateModalOpen = false;
  isLoadingProjectCreate = false;
  isProjectEditModalOpen = false;
  editingProject = null;
  isLoadingProjectUpdate = false;
  isLoadingProjectDelete = false;
  rootStore;

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  // --- УДАЛЕНИЕ КУРСА ---
  async deleteCourse(courseId) {
    this.isLoadingDelete = true;
    try {
      await api.delete(`/courses/${courseId}`);
      toastSuccess("Курс успешно удален."); // <-- Уведомление об успехе
      runInAction(() => {
        this.fetchCourses();
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Не удалось удалить курс.";
      toastError(errorMessage); // <-- Уведомление об ошибке
      console.error(`Ошибка при удалении курса ${courseId}:`, error);
      throw error;
    } finally {
      runInAction(() => {
        this.isLoadingDelete = false;
      });
    }
  }

  // ... openEditModal и closeEditModal без изменений ...
  openEditModal(course) {
    this.editingCourse = course; // Запоминаем, какой курс редактируем
    this.isEditModalOpen = true;
  }
  closeEditModal() {
    this.editingCourse = null; // Очищаем
    this.isEditModalOpen = false;
  }

  // --- ОБНОВЛЕНИЕ КУРСА ---
  async updateCourse(courseId, courseData) {
    this.isLoadingUpdate = true;
    try {
      const response = await api.put(`/courses/${courseId}`, courseData);
      toastSuccess(`Курс "${response.data.title}" обновлен.`); // <-- Уведомление об успехе
      runInAction(() => {
        this.closeEditModal();
        this.fetchCourses();
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Не удалось обновить курс.";
      toastError(errorMessage); // <-- Уведомление об ошибке
      console.error(`Ошибка при обновлении курса ${courseId}:`, error);
      throw error;
    } finally {
      runInAction(() => {
        this.isLoadingUpdate = false;
      });
    }
  }

  // --- 4. НОВЫЕ ACTIONS ДЛЯ УПРАВЛЕНИЯ МОДАЛЬНЫМ ОКНОМ ---
  openCreateModal() {
    this.isCreateModalOpen = true;
  }
  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  openProjectCreateModal = () => {
    this.isProjectCreateModalOpen = true;
  };
  closeProjectCreateModal = () => {
    this.isProjectCreateModalOpen = false;
  };

  // --- СОЗДАНИЕ КУРСА ---
  async createCourse(courseData) {
    this.isLoadingCreate = true;
    try {
      const response = await api.post("/courses", courseData);
      toastSuccess(`Курс "${response.data.title}" успешно создан!`); // <-- Уведомление об успехе
      runInAction(() => {
        this.closeCreateModal();
        this.fetchCourses();
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Не удалось создать курс.";
      toastError(errorMessage); // <-- Уведомление об ошибке
      console.error("Ошибка при создании курса:", error);
      throw error;
    } finally {
      runInAction(() => {
        this.isLoadingCreate = false;
      });
    }
  }

  //   Action для загрузки всех курсов
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
  // --- 5. Добавляем новый action для загрузки одного курса ---
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

  // --- СОЗДАНИЕ ПРОЕКТА ---
  async createProject(projectData) {
    if (!this.currentCourse) throw new Error("Курс не загружен.");
    this.isLoadingProjectCreate = true;
    try {
      const dataToSend = { ...projectData, course_id: this.currentCourse.id };
      const response = await api.post("/projects", dataToSend);
      toastSuccess(`Проект "${response.data.title}" успешно создан!`); // <-- Уведомление об успехе
      runInAction(async () => {
        this.closeProjectCreateModal();
        await this.fetchCourseBySlug(this.currentCourse.slug);
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Не удалось создать проект.";
      toastError(errorMessage); // <-- Уведомление об ошибке
      console.error("Ошибка при создании проекта:", error);
      throw error;
    } finally {
      runInAction(() => {
        this.isLoadingProjectCreate = false;
      });
    }
  }

  // --- ACTIONS ДЛЯ РЕДАКТИРОВАНИЯ ПРОЕКТА ---
    openProjectEditModal = (project) => {
      this.editingProject = project;
      this.isProjectEditModalOpen = true;
    };
    closeProjectEditModal = () => {
      this.editingProject = null;
      this.isProjectEditModalOpen = false;
    };

  // --- УДАЛЕНИЕ ПРОЕКТА ---
  async deleteProject(projectId) {
    this.isLoadingProjectDelete = true;
    try {
      await api.delete(`/projects/${projectId}`);
      toastSuccess("Проект успешно удален."); // <-- Уведомление об успехе
      runInAction(async () => {
        await this.fetchCourseBySlug(this.currentCourse.slug);
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Не удалось удалить проект.";
      toastError(errorMessage); // <-- Уведомление об ошибке
      console.error(`Ошибка при удалении проекта ${projectId}:`, error);
      throw error;
    } finally {
      runInAction(() => {
        this.isLoadingProjectDelete = false;
      });
    }
  }
}

// /**
//  * @file stores/CourseStore.js
//  * @description MobX-стор для управления данными курсов.
//  */
// import { makeAutoObservable, runInAction } from "mobx";
// import api from "../api"; // Наш API-клиент
// import { toastSuccess, toastError } from "../utils/toast";

// export class CourseStore {
//   courses = [];
//   currentCourse = null;
//   isLoading = false;
//   isCreateModalOpen = false; // Управляет видимостью модального окна
//   isLoadingCreate = false; // Отдельный флаг загрузки для процесса создания
//   isEditModalOpen = false;
//   editingCourse = null; // Здесь будет храниться объект курса для редактирования
//   isLoadingUpdate = false;
//   isLoadingDelete = false;
//   isProjectCreateModalOpen = false;
//   isLoadingProjectCreate = false;
//   isProjectEditModalOpen = false;
//   editingProject = null;
//   isLoadingProjectUpdate = false;
//   isLoadingProjectDelete = false;
//   rootStore;

//   constructor(rootStore) {
//     makeAutoObservable(this);
//     this.rootStore = rootStore;
//   }

//   // --- 1. НОВЫЙ ACTION ДЛЯ УДАЛЕНИЯ КУРСА ---
//   async deleteCourse(courseId) {
//     this.isLoadingDelete = true;
//     try {
//       // Используем DELETE-запрос, который мы уже создали на бэкенде
//       await api.delete(`/courses/${courseId}`);

//       runInAction(() => {
//         // Просто обновляем список курсов, чтобы удаленный исчез
//         this.fetchCourses();
//       });
//     } catch (error) {
//       console.error(`Ошибка при удалении курса ${courseId}:`, error);
//       // В реальном приложении здесь бы показывалось уведомление об ошибке
//       throw error;
//     } finally {
//       runInAction(() => {
//         this.isLoadingDelete = false;
//       });
//     }
//   }

//   // --- 2. НОВЫЕ ACTIONS ДЛЯ УПРАВЛЕНИЯ РЕДАКТИРОВАНИЕМ ---
//   openEditModal(course) {
//     this.editingCourse = course; // Запоминаем, какой курс редактируем
//     this.isEditModalOpen = true;
//   }
//   closeEditModal() {
//     this.editingCourse = null; // Очищаем
//     this.isEditModalOpen = false;
//   }

//   // --- 3. НОВЫЙ ACTION ДЛЯ ОБНОВЛЕНИЯ КУРСА ---
//   async updateCourse(courseId, courseData) {
//     this.isLoadingUpdate = true;
//     try {
//       // Используем PUT-запрос, который мы уже создали на бэкенде
//       await api.put(`/courses/${courseId}`, courseData);

//       runInAction(() => {
//         this.closeEditModal();
//         this.fetchCourses(); // Обновляем список, чтобы увидеть изменения
//       });
//     } catch (error) {
//       console.error(`Ошибка при обновлении курса ${courseId}:`, error);
//       throw error;
//     } finally {
//       runInAction(() => {
//         this.isLoadingUpdate = false;
//       });
//     }
//   }

//   // --- 4. НОВЫЕ ACTIONS ДЛЯ УПРАВЛЕНИЯ МОДАЛЬНЫМ ОКНОМ ---
//   openCreateModal() {
//     this.isCreateModalOpen = true;
//   }
//   closeCreateModal() {
//     this.isCreateModalOpen = false;
//   }

//   openProjectCreateModal = () => {
//     this.isProjectCreateModalOpen = true;
//   };
//   closeProjectCreateModal = () => {
//     this.isProjectCreateModalOpen = false;
//   };

//   // --- 3. НОВЫЙ ACTION ДЛЯ СОЗДАНИЯ КУРСА ---
//   async createCourse(courseData) {
//     this.isLoadingCreate = true;
//     try {
//       // Мы используем тот же эндпоинт, что и раньше, он уже готов
//       await api.post("/courses", courseData);

//       // После успешного создания:
//       runInAction(() => {
//         this.closeCreateModal(); // Закрываем модальное окно
//         // И САМОЕ ГЛАВНОЕ: обновляем список курсов, чтобы увидеть новый
//         this.fetchCourses();
//       });
//     } catch (error) {
//       console.error("Ошибка при создании курса:", error);
//       // Пробрасываем ошибку, чтобы компонент формы мог ее показать
//       throw error;
//     } finally {
//       runInAction(() => {
//         this.isLoadingCreate = false;
//       });
//     }
//   }

//   // Action для загрузки всех курсов
//   async fetchCourses() {
//     this.isLoading = true;
//     try {
//       const response = await api.get("/courses"); // Запрос на наш бэкенд
//       runInAction(() => {
//         // Мы используем eager loading на бэке, поэтому курсы придут сразу с проектами
//         this.courses = response.data;
//       });
//     } catch (error) {
//       console.error("Не удалось загрузить курсы:", error);
//     } finally {
//       runInAction(() => {
//         this.isLoading = false;
//       });
//     }
//   }
//   // --- 5. Добавляем новый action для загрузки одного курса ---
//   async fetchCourseBySlug(slug) {
//     this.isLoading = true;
//     this.currentCourse = null; // Сбрасываем предыдущий курс
//     try {
//       // Запрос на наш бэкенд, который мы создали ранее
//       const response = await api.get(`/courses/${slug}`);
//       runInAction(() => {
//         this.currentCourse = response.data;
//       });
//     } catch (error) {
//       console.error(`Не удалось загрузить курс ${slug}:`, error);
//       // Можно добавить обработку ошибки 404
//     } finally {
//       runInAction(() => {
//         this.isLoading = false;
//       });
//     }
//   }

//   // --- НОВЫЙ ACTION ДЛЯ СОЗДАНИЯ ПРОЕКТА ---
//   async createProject(projectData) {
//     if (!this.currentCourse) {
//       throw new Error("Невозможно создать проект: курс не загружен.");
//     }

//     this.isLoadingProjectCreate = true;
//     try {
//       // Добавляем ID текущего курса к данным проекта
//       const dataToSend = { ...projectData, course_id: this.currentCourse.id };

//       // Используем API-эндпоинт, который мы уже создали
//       await api.post("/projects", dataToSend);

//       runInAction(async () => {
//         // После успешного создания:
//         this.closeProjectCreateModal();
//         // И самое главное: обновляем данные текущего курса, чтобы увидеть новый проект
//         await this.fetchCourseBySlug(this.currentCourse.slug);
//       });
//     } catch (error) {
//       console.error("Ошибка при создании проекта:", error);
//       throw error; // Пробрасываем ошибку, чтобы форма могла ее показать
//     } finally {
//       runInAction(() => {
//         this.isLoadingProjectCreate = false;
//       });
//     }
//   }

//   // --- ACTIONS ДЛЯ РЕДАКТИРОВАНИЯ ПРОЕКТА ---
//   openProjectEditModal = (project) => {
//     this.editingProject = project;
//     this.isProjectEditModalOpen = true;
//   };
//   closeProjectEditModal = () => {
//     this.editingProject = null;
//     this.isProjectEditModalOpen = false;
//   };

//   // --- ACTION ДЛЯ УДАЛЕНИЯ ПРОЕКТА ---
//   async deleteProject(projectId) {
//     this.isLoadingProjectDelete = true;
//     try {
//       await api.delete(`/projects/${projectId}`);
//       runInAction(async () => {
//         // Обновляем данные, чтобы удаленный проект исчез
//         await this.fetchCourseBySlug(this.currentCourse.slug);
//       });
//     } catch (error) {
//       console.error(`Ошибка при удалении проекта ${projectId}:`, error);
//       throw error;
//     } finally {
//       runInAction(() => {
//         this.isLoadingProjectDelete = false;
//       });
//     }
//   }
// }
