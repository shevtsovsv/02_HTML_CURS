import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import ProjectListItem from "../components/ProjectListItem";
import ProjectFormModal from "../components/modals/ProjectFormModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import "./CoursePage.css"; // Подключаем стили

const CoursePage = observer(() => {
  const { authStore, courseStore } = useStore();
  const { slug } = useParams();

  const [isProjectDeleteModalOpen, setProjectDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    const loadAndLog = async () => {
      if (slug) {
        // 1. Ждем, пока данные загрузятся
        await courseStore.fetchCourseBySlug(slug);

        // // 2. Теперь, когда данные точно есть, логируем их
        // if (courseStore.currentCourse?.projects?.length > 0) {
        //   console.log(
        //     "ПОЛУЧЕННЫЕ ДАННЫЕ ДЛЯ ПЕРВОГО ПРОЕКТА:",
        //     // Превращаем MobX-прокси в обычный JS-объект для чистого вывода
        //     JSON.parse(JSON.stringify(courseStore.currentCourse.projects[0]))
        //   );
        // }
      }
    };
    loadAndLog();
  }, [slug, courseStore]);

  if (courseStore.isLoading || !courseStore.currentCourse) {
    return <div>Загрузка курса...</div>;
  }

  const { title, description, projects } = courseStore.currentCourse;

  const handleOpenDeleteModal = (project) => {
    setProjectToDelete(project);
    setProjectDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      await courseStore.deleteProject(projectToDelete.id);
      setProjectDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="course-page-container">
      <div className="course-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <h2>Проекты курса</h2>
      {/* --- КНОПКА ДЛЯ АДМИНА --- */}
      {authStore.isAdmin && (
        <button
          onClick={() => courseStore.openProjectCreateModal()}
          className="btn-primary"
          style={{ marginBottom: "1.5rem" }}
        >
          + Создать проект
        </button>
      )}
      {/* ------------------------ */}
      <div>
        {projects && projects.length > 0 ? (
          projects
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((project) => {
			// Проверяем, что у проекта вообще есть шаги
              const totalSteps = project.steps?.length || 0;
              // Считаем количество пройденных шагов для этого проекта
              const completedSteps = project.userProgresses?.filter(p => p.completed).length || 0;
              const isCompleted = totalSteps > 0 && completedSteps === totalSteps;

				return (
          <ProjectListItem
            key={project.id}
            project={project}
            isAdmin={authStore.isAdmin}
            onEdit={courseStore.openProjectEditModal}
            onDelete={handleOpenDeleteModal}
            isCompleted={isCompleted}
          />
        );
            })
        ) : (
          <p>В этом курсе пока нет проектов.</p>
        )}
      </div>
      <ProjectFormModal />
      <ConfirmDeleteModal
        isOpen={isProjectDeleteModalOpen}
        onClose={() => setProjectDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Удалить проект "${projectToDelete?.title}"?`}
        isLoading={courseStore.isLoadingProjectDelete}
      />
    </div>
  );
});

export default CoursePage;
