/**
 * @file components/ProjectPage/TaskPanel.jsx
 * @description Левая панель с инструкциями для текущего шага.
 */
import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";

const TaskPanel = observer(({ currentStep, onCheck }) => {
  const { projectStore } = useStore();

  if (!currentStep) {
    return <div className="task-panel">Загрузка задания...</div>;
  }

  return (
    <div className="task-panel">
      <h2>Шаг {currentStep.order}</h2>
      <p>{currentStep.instructions}</p>

      {/* Кнопка проверки */}
      <button
        onClick={onCheck}
        className="check-btn"
        disabled={projectStore.isChecking}
      >
        {projectStore.isChecking ? "Проверка..." : "Проверить"}
      </button>

      {/* Отображение результата проверки */}
      {projectStore.validationResult && (
        <div
          className={
            projectStore.validationResult.success ? "success" : "error"
          }
          style={{ marginTop: "1rem" }}
        >
          {projectStore.validationResult.success ? (
            <p>{projectStore.validationResult.message}</p>
          ) : (
            projectStore.validationResult.errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))
          )}
        </div>
      )}
    </div>
  );
});

export default TaskPanel;
