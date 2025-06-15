/**
 * @file pages/ProjectPage.jsx
 * @description Основное рабочее пространство для решения проекта.
 */
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";
import Editor from "@monaco-editor/react";
import Split from "react-split"; // Библиотека для создания изменяемых панелей
import { useDebounce } from "use-debounce"; // Популярная и простая библиотека для debounce
import "./ProjectPage.css"; // Создадим этот файл для стилей

// --- Компонент Превью ---
const PreviewPane = ({ html, css, js }) => {
  const documentContent = useMemo(() => {
    return `
      <html>
        <head><style>${css}</style></head>
        <body>${html}</body>
        <script>${js}</script>
      </html>
    `;
  }, [html, css, js]);

  return (
    <iframe
      srcDoc={documentContent}
      title="preview"
      sandbox="allow-scripts"
      width="100%"
      height="100%"
      style={{ border: "none" }}
    />
  );
};

// --- Компонент Панели Задач ---
const TaskPanel = observer(() => {
  const { projectStore } = useStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // --- 1. ГЛАВНОЕ ИЗМЕНЕНИЕ: Добавляем "защиту" ---
  // Если проект еще не загружен, компонент не должен пытаться ничего делать.
  // Мы можем вернуть null или заглушку.
  if (!projectStore.currentProject || !projectStore.currentProject.steps) {
    return <div>Загрузка шагов...</div>; // или просто return null;
  }
  // ----------------------------------------------------

  const { steps, id: projectId } = projectStore.currentProject;

  // --- 2. Дополнительная защита ---
  // Убедимся, что у нас есть шаги и индекс не выходит за пределы массива
  if (steps.length === 0 || !steps[currentStepIndex]) {
    return <div>В этом проекте нет шагов.</div>;
  }

  const currentStep = steps[currentStepIndex];

  const handleCheck = () => {
    projectStore.checkStep(projectId, currentStep.id);
  };

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      projectStore.validationResult = null; // Сбрасываем результат проверки при переключении
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      projectStore.validationResult = null; // Сбрасываем результат
    }
  };

  return (
    <div className="task-panel">
      {/* Навигация по шагам */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button onClick={goToPrevStep} disabled={currentStepIndex === 0}>
          ← Назад
        </button>
        <span>
          Шаг {currentStepIndex + 1} из {steps.length}
        </span>
        <button
          onClick={goToNextStep}
          disabled={currentStepIndex === steps.length - 1}
        >
          Вперед →
        </button>
      </div>

      <h3>{currentStep.title || `Шаг ${currentStep.order}`}</h3>
      <p>{currentStep.instructions}</p>
      <button onClick={handleCheck} disabled={projectStore.isChecking}>
        {projectStore.isChecking ? "Проверка..." : "Проверить"}
      </button>
      {projectStore.validationResult && (
        <div
          className={
            projectStore.validationResult.success ? "success" : "error"
          }
        >
          {/* ... код отображения результата без изменений ... */}
        </div>
      )}
    </div>
  );
});

// --- Основной Компонент Страницы ---
const ProjectPage = observer(() => {
  const { projectStore } = useStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      projectStore.fetchProject(id);
    }
  }, [id, projectStore]);

  if (projectStore.isLoading || !projectStore.currentProject) {
    return <div>Загрузка проекта...</div>;
  }
  return <Workspace project={projectStore.currentProject} />;
});

const Workspace = observer(({ project }) => {
  const { projectStore } = useStore();

  // Инициализируем локальное состояние прямо из пропсов.
  // Это безопасно, так как Workspace рендерится только когда `project` уже есть.
  const [localHtml, setLocalHtml] = useState(project.html_template || "");
  const [localCss, setLocalCss] = useState(project.css_template || "");
  const [localJs, setLocalJs] = useState(project.js_template || "");

  const [debouncedHtml] = useDebounce(localHtml, 500);
  const [debouncedCss] = useDebounce(localCss, 500);
  const [debouncedJs] = useDebounce(localJs, 5000);

  // useEffect'ы для обновления стора остаются без изменений
  useEffect(() => {
    projectStore.updateCode("html", debouncedHtml);
  }, [debouncedHtml, projectStore]);
  useEffect(() => {
    projectStore.updateCode("css", debouncedCss);
  }, [debouncedCss, projectStore]);
  useEffect(() => {
    projectStore.updateCode("javascript", debouncedJs);
  }, [debouncedJs, projectStore]);

  return (
    <Split className="split-container" sizes={[30, 70]} minSize={200}>
      <TaskPanel />
      <Split
        direction="vertical"
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        sizes={[50, 50]}
      >
        <Split className="split-editors" sizes={[33, 33, 34]}>
          <Editor
            height="100%"
            language="html"
            value={localHtml}
            onChange={setLocalHtml}
            theme="vs-dark"
          />
          <Editor
            height="100%"
            language="css"
            value={localCss}
            onChange={setLocalCss}
            theme="vs-dark"
          />
          <Editor
            height="100%"
            language="javascript"
            value={localJs}
            onChange={setLocalJs}
            theme="vs-dark"
          />
        </Split>
        <div className="preview-pane">
          <PreviewPane
            html={debouncedHtml}
            css={debouncedCss}
            js={debouncedJs}
          />
        </div>
      </Split>
    </Split>
  );
});

export default ProjectPage;
