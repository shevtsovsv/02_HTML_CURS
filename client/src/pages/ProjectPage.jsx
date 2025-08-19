/**
 * @file pages/ProjectPage.jsx
 * @description Основная страница-контейнер для рабочего пространства проекта.
 * Управляет состоянием текущего шага и отображает основной макет.
 */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";
import TaskPanel from "../components/ProjectPage/TaskPanel";
import Workspace from "../components/ProjectPage/Workspace";
import "./ProjectPage.css"; // Импортируем стили из нового файла

// --- Новый суб-компонент для хедера интерфейса ---
// Он получает все необходимые данные и функции через props.
const InterfaceHeader = ({
  currentStepIndex,
  totalSteps,
  onPrev,
  onNext,
  isNextDisabled,
}) => {
  return (
    <header className="interface-header">
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
        <button className="show-example-btn">Показать пример</button>
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

  // Загрузка данных проекта и инициализация состояния
  useEffect(() => {
    const loadData = async () => {
      if (projectId) {
        await projectStore.fetchProject(projectId);

        // После загрузки данных, инициализируем пройденные шаги с сервера
        if (projectStore.currentProject?.userProgresses) {
          const completedIds = projectStore.currentProject.userProgresses
            .filter((p) => p.completed)
            .map((p) => p.step_id);
          setCompletedSteps(new Set(completedIds));
        }

        // Сбрасываем индекс на первый шаг при загрузке нового проекта
        setCurrentStepIndex(0);
      }
    };
    loadData();
  }, [projectId, projectStore]); // Перезапускаем только при смене ID проекта

  // Обработка результата проверки и авто-переключение
  useEffect(() => {
    if (projectStore.validationResult?.success) {
      const currentStepId =
        projectStore.currentProject?.steps[currentStepIndex]?.id;

      if (currentStepId && projectId) {
        setCompletedSteps((prev) => new Set(prev).add(currentStepId));
        projectStore.markStepAsCompleted(projectId, currentStepId);
      }

      const timer = setTimeout(() => {
        if (currentStepIndex < projectStore.currentProject.steps.length - 1) {
          goToNextStep();
        } else {
          alert("Поздравляем! Проект завершен!");
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [projectStore.validationResult]); // Зависимость только от результата

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

  // --- JSX ---
  return (
    <div className="learning-interface">
      <InterfaceHeader
        currentStepIndex={currentStepIndex}
        totalSteps={project.steps.length}
        onPrev={goToPrevStep}
        onNext={goToNextStep}
        isNextDisabled={!isCurrentStepCompleted && !isLastStep}
      />
      <main className="main-content">
        <TaskPanel currentStep={currentStep} onCheck={handleCheck} />
        <Workspace
          // `key` здесь - самый надежный способ сбросить состояние редакторов при смене шага
          key={currentStep.id}
          project={project}
          currentStep={currentStep}
        />
      </main>
    </div>
  );
});

export default ProjectPage;
