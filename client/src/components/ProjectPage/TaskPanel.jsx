import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";

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

export default TaskPanel;