/**
 * @file pages/ProjectPage.jsx
 */
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";
import Editor from "@monaco-editor/react";
import Split from "react-split";
import { useDebounce } from "use-debounce";
import "./ProjectPage.css";

// --- Компонент Превью ---
const PreviewPane = ({ html, css, js }) => {
  const documentContent = useMemo(
    () => `
    <html>
      <head><style>${css}</style></head>
      <body>${html}</body>
      <script>${js}</script>
    </html>
  `,
    [html, css, js]
  );

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
const TaskPanel = observer(
  ({
    currentStep,
    currentStepIndex,
    totalSteps,
    isNextStepUnlocked,
    onNext,
    onPrev,
    onCheck,
  }) => {
    const { projectStore } = useStore();
    if (!currentStep) {
      return <div className="task-panel">Загрузка задания...</div>;
    }

    return (
      <div className="task-panel">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <button onClick={onPrev} disabled={currentStepIndex === 0}>
            ← Назад
          </button>
          <span>
            Шаг {currentStepIndex + 1} из {totalSteps}
          </span>
          <button
            onClick={onNext}
            disabled={
              !isNextStepUnlocked && currentStepIndex !== totalSteps - 1
            }
          >
            Вперед →
          </button>
        </div>

        <h3>{currentStep.title || `Шаг ${currentStepIndex + 1}`}</h3>
        <p>{currentStep.instructions}</p>

        <button onClick={onCheck} disabled={projectStore.isChecking}>
          {projectStore.isChecking ? "Проверка..." : "Проверить"}
        </button>

        {projectStore.validationResult && (
          <div
            className={
              projectStore.validationResult.success ? "success" : "error"
            }
          >
            {/* ... ваш код отображения результата ... */}
          </div>
        )}
      </div>
    );
  }
);

// --- Компонент Рабочей Области ---
const Workspace = observer(({ project, currentStep }) => {
  const { projectStore } = useStore();

  const initialCode = useMemo(() => {
    if (!currentStep) return { html: "", css: "", js: "" };

    const userCodeForStep = project.userCodes?.find(
      (code) => code.step_id === currentStep.id
    );

    return {
      html: userCodeForStep?.html ?? currentStep.html_template ?? "",
      css: userCodeForStep?.css ?? currentStep.css_template ?? "",
      js: userCodeForStep?.js ?? currentStep.js_template ?? "",
    };
  }, [project, currentStep]);

  const [localHtml, setLocalHtml] = useState(initialCode.html);
  const [localCss, setLocalCss] = useState(initialCode.css);
  const [localJs, setLocalJs] = useState(initialCode.js);

  const [debouncedHtml] = useDebounce(localHtml, 500);
  const [debouncedCss] = useDebounce(localCss, 500);
  const [debouncedJs] = useDebounce(localJs, 1000);

  useEffect(() => {
    projectStore.updateCode("html", localHtml);
    projectStore.updateCode("css", localCss);
    projectStore.updateCode("javascript", localJs);
  }, [localHtml, localCss, localJs, projectStore]);

  useEffect(() => {
    setLocalHtml(initialCode.html);
    setLocalCss(initialCode.css);
    setLocalJs(initialCode.js);
  }, [currentStep, initialCode]);

  return (
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
        <PreviewPane html={debouncedHtml} css={debouncedCss} js={debouncedJs} />
      </div>
    </Split>
  );
});

// --- Основной Компонент Страницы ---
const ProjectPage = observer(() => {
  const { projectStore } = useStore();
  const { id } = useParams();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // ИСПРАВЛЕНИЕ: Убираем `projectStore` из массива зависимостей.
  // Функции, являющиеся методами класса (особенно MobX), обычно имеют стабильную ссылку
  // и их не нужно включать в зависимости.
  useEffect(() => {
    if (id) {
      projectStore.fetchProject(id);
    }
    // Сброс индекса при смене проекта (когда меняется `id`)
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
  }, [id, projectStore]);

  useEffect(() => {
    if (projectStore.validationResult?.success) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep.id));
      const timer = setTimeout(() => {
        if (currentStepIndex < projectStore.currentProject.steps.length - 1) {
			goToNextStep();
        } else {
          alert("Поздравляем! Проект завершен!");
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [projectStore.validationResult]);

  if (projectStore.isLoading || !projectStore.currentProject) {
    return <div>Загрузка проекта...</div>;
  }

  const project = projectStore.currentProject;

  if (!project.steps || project.steps.length === 0) {
    return <div>В этом проекте нет шагов.</div>;
  }

  const currentStep = project.steps[currentStepIndex];

  const goToNextStep = () => {
    if (currentStepIndex < project.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      projectStore.validationResult = null;
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      projectStore.validationResult = null;
    }
  };

  const handleCheck = async () => {
    // Делаем функцию асинхронной
    if (currentStep) {
      // Собираем актуальный код из стора
      // (он будет свежим, так как debounce для updateCode уже сработал)
      const codeToProcess = {
        html: projectStore.htmlCode,
        css: projectStore.cssCode,
        js: projectStore.jsCode,
      };

      // 1. Сначала СОХРАНЯЕМ код. Мы ждем завершения этой операции.
      await projectStore.saveCode(project.id, currentStep.id, codeToProcess);

      // 2. И только потом отправляем его на ПРОВЕРКУ.
      projectStore.checkStep(project.id, currentStep.id, codeToProcess);
    }
  };
  const isCurrentStepCompleted = completedSteps.has(currentStep?.id);

  return (
    <Split className="split-container" sizes={[30, 70]} minSize={200}>
      <TaskPanel
        currentStep={currentStep}
        currentStepIndex={currentStepIndex}
        totalSteps={project.steps.length}
        isNextStepUnlocked={isCurrentStepCompleted}
        onNext={goToNextStep}
        onPrev={goToPrevStep}
        onCheck={handleCheck}
      />
      <Workspace project={project} currentStep={currentStep} />
    </Split>
  );
});

export default ProjectPage;
