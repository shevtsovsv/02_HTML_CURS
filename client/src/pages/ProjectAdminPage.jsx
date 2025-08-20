/**
 * @file pages/ProjectAdminPage.jsx
 * @description Страница для администрирования одного проекта и его шагов.
 */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";
import StepFormModal from "../components/modals/StepFormModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
// Можно создать стили для этой страницы, например, ProjectAdminPage.css

const ProjectAdminPage = observer(() => {
  const { projectStore } = useStore();
  const { id: projectId } = useParams();

  const [stepToDelete, setStepToDelete] = useState(null);

  useEffect(() => {
    if (projectId) {
      projectStore.fetchProject(projectId);
    }
  }, [projectId, projectStore]);

  const handleConfirmDelete = async () => {
    if (stepToDelete) {
      await projectStore.deleteStep(stepToDelete.id);
      setStepToDelete(null);
    }
  };

  if (projectStore.isLoading || !projectStore.currentProject) {
    return <div>Загрузка данных проекта...</div>;
  }

  const project = projectStore.currentProject;

  return (
    <div
      className="admin-page-container"
      style={{ maxWidth: "1000px", margin: "0 auto" }}
    >
      <div className="admin-header" style={{ marginBottom: "2rem" }}>
        <Link to={`/courses/${project.course?.slug}`}>
          &larr; Вернуться к курсу
        </Link>
        <h1>Управление проектом: {project.title}</h1>
      </div>

      <div className="steps-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2>Шаги проекта</h2>
          <button
            onClick={() => projectStore.openStepCreateModal()}
            className="btn-primary"
          >
            + Добавить шаг
          </button>
        </div>

        {/* Список шагов */}
        <div className="steps-list">
          {project.steps
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <div
                key={step.id}
                className="step-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  border: "1px solid #eee",
                  padding: "1rem",
                  marginBottom: "0.5rem",
                  borderRadius: "6px",
                }}
              >
                <div>
                  <strong>Шаг {step.order}:</strong>{" "}
                  {step.instructions.substring(0, 100)}...
                </div>
                <div>
                  <button
                    onClick={() => projectStore.openStepEditModal(step)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    ✏️
                  </button>
                  <button onClick={() => setStepToDelete(step)}>🗑️</button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Модальные окна */}
      <StepFormModal />
      <ConfirmDeleteModal
        isOpen={!!stepToDelete}
        onClose={() => setStepToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Удалить Шаг ${stepToDelete?.order}?`}
        isLoading={projectStore.isLoadingStepAction}
      />
    </div>
  );
});

export default ProjectAdminPage;
