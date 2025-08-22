/**
 * @file pages/ProjectPage.jsx
 * @description Основная страница-контейнер для рабочего пространства проекта.
 * Управляет состоянием текущего шага и отображает основной макет.
 */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";
import Split from "react-split"; // <-- 1. Импортируем Split
import TaskPanel from "../components/ProjectPage/TaskPanel";
import Workspace from "../components/ProjectPage/Workspace";
import ExampleModal from "../components/modals/ExampleModal";
import "./ProjectPage.css"; // Импортируем стили из нового файла

// --- Новый суб-компонент для хедера интерфейса ---
// Он получает все необходимые данные и функции через props.
const InterfaceHeader = ({
  currentStepIndex,
  totalSteps,
  onPrev,
  onNext,
  isNextDisabled,
  courseSlug,
  onShowExample,
}) => {
  return (
    <header className="interface-header">
      <div className="header-course-link">
        {courseSlug ? (
          <Link to={`/courses/${courseSlug}`}>&larr; Вернуться к курсу</Link>
        ) : (
          <span style={{ color: "var(--text-light)" }}>&larr; Загрузка...</span>
        )}
      </div>
      <div className="step-counter">
        Шаг {currentStepIndex + 1} из {totalSteps}
      </div>
      <div className="header-actions">
        <button onClick={onPrev} disabled={currentStepIndex === 0}>
          &lt; Назад
        </button>
        <button onClick={onNext} disabled={isNextDisabled}>
          Вперед &gt;
        </button>
        <button className="show-example-btn" onClick={onShowExample}>
          Показать пример
        </button>
      </div>
    </header>
  );
};

// --- Основной Компонент Страницы ---
const ProjectPage = observer(() => {
  const { projectStore } = useStore();
  const { id: projectId } = useParams(); // Переименовываем `id` в `projectId` для ясности

  // --- Состояние (State) ---
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // --- Эффекты (Lifecycle) ---

  // Эффект №1: ТОЛЬКО для загрузки данных.
  // Запускается один раз при смене projectId.
  useEffect(() => {
    if (projectId) {
      projectStore.fetchProject(projectId);
    }
  }, [projectId, projectStore]); // projectStore здесь безопасен, т.к. ссылка на него стабильна

  // Эффект №2: ТОЛЬКО для инициализации состояния ПОСЛЕ загрузки данных.
  // Запускается один раз, когда currentProject меняется с null на объект.
  useEffect(() => {
    if (projectStore.currentProject) {
      const progresses = projectStore.currentProject.userProgresses || [];
      const completedIds = progresses
        .filter((p) => p.completed)
        .map((p) => p.step_id);

      setCompletedSteps(new Set(completedIds));
      setCurrentStepIndex(0); // Всегда начинаем с первого шага
    }
  }, [projectStore.currentProject]);

  // Эффект №3: ТОЛЬКО для реакции на результат проверки.
  useEffect(() => {
    if (projectStore.validationResult?.success) {
      const project = projectStore.currentProject;
      if (!project) return;

      const currentStepId = project.steps[currentStepIndex]?.id;

      if (currentStepId) {
        setCompletedSteps((prev) => new Set(prev).add(currentStepId));
        projectStore.markStepAsCompleted(projectId, currentStepId);
      }

      const timer = setTimeout(() => {
        if (currentStepIndex < project.steps.length - 1) {
          goToNextStep();
        } else {
          alert("Поздравляем! Проект завершен!");
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectStore.validationResult]);

  // --- Рендеринг Заглушек ---
  if (projectStore.isLoading || !projectStore.currentProject) {
    return <div>Загрузка проекта...</div>;
  }
  const project = projectStore.currentProject;

  if (!project.steps || project.steps.length === 0) {
    return <div>В этом проекте нет шагов.</div>;
  }
  const currentStep = project.steps.slice().sort((a, b) => a.order - b.order)[
    currentStepIndex
  ];

  // --- Обработчики событий (Handlers) ---

  const goToNextStep = () => {
    if (currentStepIndex < project.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      projectStore.resetValidationResult();
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      projectStore.resetValidationResult();
    }
  };

  const handleCheck = async () => {
    if (currentStep) {
      const codeToProcess = {
        html: projectStore.htmlCode,
        css: projectStore.cssCode,
        js: projectStore.jsCode,
      };
      await projectStore.saveCode(project.id, currentStep.id, codeToProcess);
      projectStore.checkStep(project.id, currentStep.id, codeToProcess);
    }
  };

  // --- Вычисляемые значения для рендера ---
  const isCurrentStepCompleted = completedSteps.has(currentStep?.id);
  const isLastStep = currentStepIndex === project.steps.length - 1;
  const courseSlug = project.course?.slug;

  // --- JSX ---
  return (
    <div className="learning-interface">
      <InterfaceHeader
        currentStepIndex={currentStepIndex}
        totalSteps={project.steps.length}
        onPrev={goToPrevStep}
        onNext={goToNextStep}
        isNextDisabled={!isCurrentStepCompleted && !isLastStep}
        courseSlug={courseSlug}
        onShowExample={projectStore.openExampleModal}
      />
      <Split
        className="main-content"
        sizes={[30, 70]} // Начальные размеры: 30% для заданий, 70% для редактора
        minSize={300} // Минимальный размер каждой панели
        gutterSize={10}
      >
        <TaskPanel currentStep={currentStep} onCheck={handleCheck} />
        <Workspace project={project} currentStep={currentStep} />
      </Split>
      <ExampleModal
        isOpen={projectStore.isExampleModalOpen}
        onClose={projectStore.closeExampleModal}
        imageUrl={
          project.sampleImageUrl
            ? `http://localhost:5000${project.sampleImageUrl}`
            : ""
        } // Передаем URL картинки из данных проекта
        title={project.title}
      />
    </div>
  );
});

export default ProjectPage;
