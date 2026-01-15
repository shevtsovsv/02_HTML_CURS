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
import api from "../api";

const ProjectAdminPage = observer(() => {
  const { projectStore } = useStore();
  const { id: projectId } = useParams();

  const [stepToDelete, setStepToDelete] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("asset", selectedFile); // 'asset' - имя поля, которое ожидает multer

    try {
      // Отправляем файл на бэкенд
      await api.post(`/projects/${projectId}/upload-asset`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Важный заголовок для файлов
        },
      });
      // После успешной загрузки обновляем данные проекта, чтобы увидеть новый ассет
      await projectStore.fetchProject(projectId);
      setSelectedFile(null); // Сбрасываем выбранный файл
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      alert("Не удалось загрузить файл.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetAsSample = async (asset) => {
    try {
      // Вызываем action для обновления проекта.
      // Мы передаем только одно поле, которое хотим изменить.
      await projectStore.updateProject(projectId, {
        sampleImageUrl: asset.file_url,
      });
    } catch (error) {
      console.error("Не удалось установить изображение как пример:", error);
      alert("Произошла ошибка при назначении примера.");
    }
  };

  if (projectStore.isLoading || !projectStore.currentProject) {
    return <div>Загрузка данных проекта...</div>;
  }

  const project = projectStore.currentProject;

  const completedStepIds = new Set(
    project.userProgresses?.filter((p) => p.completed).map((p) => p.step_id) ||
      []
  );

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

      {/* --- СЕКЦИЯ ДЛЯ УПРАВЛЕНИЯ АССЕТАМИ --- */}
      <div className="assets-section" style={{ marginTop: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2>Ассеты проекта</h2>
        </div>

        {/* Форма загрузки */}
        <form
          onSubmit={handleFileUpload}
          style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
        >
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className="btn-secondary"
          >
            {isUploading ? "Загрузка..." : "Загрузить файл"}
          </button>
        </form>

        {/* Список уже загруженных ассетов */}
        <div className="assets-list" style={{ marginTop: "1.5rem" }}>
          <h4>Загруженные файлы:</h4>
          {project.assets && project.assets.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {project.assets.map((asset) => {
                // Проверяем, является ли текущий ассет образцом
                const isCurrentSample =
                  project.sampleImageUrl === asset.file_url;
                return (
                  <li
                    key={asset.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      // Подсвечиваем текущий образец
                      backgroundColor: isCurrentSample
                        ? "#ebf8ff"
                        : "transparent",
                    }}
                  >
                    <span>
                      {asset.file_name} - (<code>{asset.file_url}</code>)
                      <a
                        href={`http://localhost:5000${asset.file_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: "1rem" }}
                      >
                        Посмотреть
                      </a>
                    </span>
                    {isCurrentSample ? (
                      <span
                        style={{
                          fontWeight: 500,
                          color: "var(--accent-color)",
                        }}
                      >
                        ✓ Текущий пример
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetAsSample(asset)}
                        className="btn-secondary"
                      >
                        Сделать примером
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Для этого проекта еще не загружено ни одного файла.</p>
          )}
        </div>
      </div>
      {/* ------------------------------------------- */}

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
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => projectStore.openStepCreateModal(0)}
              className="btn-secondary"
            >
              ➕ Вставить в начало
            </button>
            <button
              onClick={() => projectStore.openStepCreateModal()}
              className="btn-primary"
            >
              + Добавить в конец
            </button>
          </div>
        </div>

        {/* Список шагов */}
        <div className="steps-list">
          {project.steps
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((step, index) => (
              <div key={step.id}>
                <div
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
                  <span style={{ marginRight: "10px" }}>
                    {completedStepIds.has(step.id) ? "✅" : "📝"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <strong>Шаг {step.order}:</strong>{" "}
                    {step.instructions.substring(0, 100)}...
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => projectStore.openStepEditModal(step)}
                      className="btn-secondary"
                      style={{ padding: "0.25rem 0.5rem" }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setStepToDelete(step)}
                      className="btn-danger"
                      style={{ padding: "0.25rem 0.5rem" }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {/* Кнопка "Вставить шаг после" */}
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <button
                    onClick={() =>
                      projectStore.openStepCreateModal(step.order + 1)
                    }
                    className="btn-outline"
                    style={{
                      padding: "0.25rem 1rem",
                      fontSize: "0.9rem",
                      border: "2px dashed #007bff",
                      backgroundColor: "transparent",
                      color: "#007bff",
                      borderRadius: "4px",
                    }}
                  >
                    ➕ Вставить шаг после шага {step.order}
                  </button>
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
