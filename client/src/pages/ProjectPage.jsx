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
// const PreviewPane = ({ html, css, js }) => {
//   const documentContent = useMemo(
//     () => `
//     <html>
//       <head><style>${css}</style></head>
//       <body>${html}</body>
//       <script>${js}</script>
//     </html>
//   `,
//     [html, css, js]
//   );

//   return (
//     <iframe
//       srcDoc={documentContent}
//       title="preview"
//       sandbox="allow-scripts"
//       width="100%"
//       height="100%"
//       style={{ border: "none" }}
//     />
//   );
// };

const PreviewPane = ({ html, css, js }) => {
  const documentContent = useMemo(() => {
    // Оборачиваем JS-код, чтобы он выполнялся безопасно
    const safeJs = `
		document.addEventListener('DOMContentLoaded', function() {
		  try {
			${js}
		  } catch (e) {
			console.error('Ошибка выполнения кода в превью:', e);
		  }
		});
	  `;
    return `
		<html>
		  <head><style>${css}</style></head>
		  <body>${html}</body>
		  <script>${safeJs}</script>
		</html>
	  `;
  }, [html, css, js]);

  return <iframe
        srcDoc={documentContent}
        title="preview"
        sandbox="allow-scripts"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />;
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
// const Workspace = observer(({ project, currentStep }) => {
//   const { projectStore } = useStore();

//   const initialCode = useMemo(() => {
//     if (!currentStep || !project.steps) return { html: "", css: "", js: "" };

//     const userCodeForStep = project.userCodes?.find(
//       (code) => code.step_id === currentStep.id
//     );

//     return {
//       html: userCodeForStep?.html ?? currentStep.html_template ?? "",
//       css: userCodeForStep?.css ?? currentStep.css_template ?? "",
//       js: userCodeForStep?.js ?? currentStep.js_template ?? "",
//     };
//   }, [project, currentStep]);

//   const [localHtml, setLocalHtml] = useState(initialCode.html);
//   const [localCss, setLocalCss] = useState(initialCode.css);
//   const [localJs, setLocalJs] = useState(initialCode.js);

//   const [debouncedHtml] = useDebounce(localHtml, 500);
//   const [debouncedCss] = useDebounce(localCss, 500);
//   const [debouncedJs] = useDebounce(localJs, 1000);

//   useEffect(() => {
//     projectStore.updateCode("html", localHtml);
//     projectStore.updateCode("css", localCss);
//     projectStore.updateCode("javascript", localJs);
//   }, [localHtml, localCss, localJs, projectStore]);

//   useEffect(() => {
//     setLocalHtml(initialCode.html);
//     setLocalCss(initialCode.css);
//     setLocalJs(initialCode.js);
//   }, [currentStep, initialCode]);

//   return (
//     <Split
//       direction="vertical"
//       style={{ display: "flex", flexDirection: "column", height: "100vh" }}
//       sizes={[50, 50]}
//     >
//       <Split className="split-editors" sizes={[33, 33, 34]}>
//         <Editor
//           height="100%"
//           language="html"
//           value={localHtml}
//           onChange={setLocalHtml}
//           theme="vs-dark"
//         />
//         <Editor
//           height="100%"
//           language="css"
//           value={localCss}
//           onChange={setLocalCss}
//           theme="vs-dark"
//         />
//         <Editor
//           height="100%"
//           language="javascript"
//           value={localJs}
//           onChange={setLocalJs}
//           theme="vs-dark"
//         />
//       </Split>
//       <div className="preview-pane">
//         <PreviewPane html={debouncedHtml} css={debouncedCss} js={debouncedJs} />
//       </div>
//     </Split>
//   );
// });

// --- Компонент Рабочей Области ---

// --- Компонент Рабочей Области ---
// --- Компонент Рабочей Области (ФИНАЛЬНАЯ ВЕРСИЯ) ---
const Workspace = observer(({ project, currentStep }) => {
  const { projectStore } = useStore();

  // Эта логика для вычисления стартового кода остается идеальной.
  const initialCode = useMemo(() => {
    if (!currentStep || !project.steps) return { html: "", css: "", js: "" };
	console.log(currentStep.id);
	

    // 1. Сначала ищем сохранённый код для текущего шага
    const userCodeForCurrentStep = project.userCodes?.find(
      (code) => code.step_id === currentStep.id
    );
    if (userCodeForCurrentStep) {
      return {
        html: userCodeForCurrentStep.html,
        css: userCodeForCurrentStep.css,
        js: userCodeForCurrentStep.js,
      };
    }

    // 2. Если кода для текущего шага нет, ищем код для ПРЕДЫДУЩЕГО шага
    const currentStepIndex = project.steps.findIndex(
      (step) => step.id === currentStep.id
    );
    if (currentStepIndex > 0) {
      const prevStep = project.steps[currentStepIndex - 1];
      const userCodeForPrevStep = project.userCodes?.find(
        (code) => code.step_id === prevStep.id
      );
      if (userCodeForPrevStep) {
        return {
          html: userCodeForPrevStep.html,
          css: userCodeForPrevStep.css,
          js: userCodeForPrevStep.js,
        };
      }
    }

    // 3. Если ничего не найдено — используем шаблоны проекта
    return {
      html: project.html_template ?? "",
      css: project.css_template ?? "",
      js: project.js_template ?? "",
    };
  }, [project, currentStep]);
  console.log(initialCode);
  // ...existing code...
  // const initialCode = useMemo(() => {
  //   if (!currentStep) return { html: "", css: "", js: "" };

  //   const userCodeForCurrentStep = project.userCodes?.find(
  // 	(code) => code.step_id === currentStep.id
  //   );

  //   if (userCodeForCurrentStep) {
  // 	return {
  // 	  html: userCodeForCurrentStep.html,
  // 	  css: userCodeForCurrentStep.css,
  // 	  js: userCodeForCurrentStep.js,
  // 	};
  //   }

  //   const currentStepIndex = project.steps.findIndex(step => step.id === currentStep.id);
  //   if (currentStepIndex > 0) {
  // 	const prevStep = project.steps[currentStepIndex - 1];
  // 	const userCodeForPrevStep = project.userCodes?.find(
  // 	  (code) => code.step_id === prevStep.id
  // 	);
  // 	if (userCodeForPrevStep) {
  // 	  return {
  // 		html: userCodeForPrevStep.html,
  // 		css: userCodeForPrevStep.css,
  // 		js: userCodeForPrevStep.js,
  // 	  };
  // 	}
  //   }

  //   return {
  // 	html: project.html_template ?? "",
  // 	css: project.css_template ?? "",
  // 	js: project.js_template ?? "",
  //   };
  // }, [project, currentStep]);

  // Локальное состояние для "мгновенного" отклика редакторов
  const [localHtml, setLocalHtml] = useState(initialCode.html);
  const [localCss, setLocalCss] = useState(initialCode.css);
  const [localJs, setLocalJs] = useState(initialCode.js);

  // Debounce для обновления глобального стора (это не меняется)
  const [debouncedHtml] = useDebounce(localHtml, 300);
  const [debouncedCss] = useDebounce(localCss, 300);
  const [debouncedJs] = useDebounce(localJs, 300);

  useEffect(() => {
    projectStore.updateCode("html", debouncedHtml);
  }, [debouncedHtml, projectStore]);
  useEffect(() => {
    projectStore.updateCode("css", debouncedCss);
  }, [debouncedCss, projectStore]);
  useEffect(() => {
    projectStore.updateCode("javascript", debouncedJs);
  }, [debouncedJs, projectStore]);

  // Синхронизирующий useEffect нам все-таки нужен, но мы его сделаем проще.
  // Он сработает, когда `initialCode` изменится (т.е. при смене шага).
  useEffect(() => {
    setLocalHtml(initialCode.html);
    setLocalCss(initialCode.css);
    setLocalJs(initialCode.js);
  }, [initialCode]);

  return (
    <Split
      direction="vertical"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      sizes={[50, 50]}
    >
      <Split className="split-editors" sizes={[33, 33, 34]}>
        {/*
			--- КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: ДОБАВЛЯЕМ KEY К РЕДАКТОРАМ ---
			Мы создаем уникальный ключ для каждого редактора, зависящий от ID шага.
			Когда ID шага меняется, React уничтожает старый <Editor> и создает новый,
			который гарантированно возьмет новое значение из `value`.
		  */}
        <Editor
          key={`html-${currentStep.id}`}
          height="100%"
          language="html"
          value={initialCode.html} // Используем defaultValue для инициализации
          onChange={setLocalHtml}
          theme="vs-dark"
        />
        <Editor
          key={`css-${currentStep.id}`}
          height="100%"
          language="css"
          value={initialCode.css}
          onChange={setLocalCss}
          theme="vs-dark"
        />
        <Editor
          key={`javascript-${currentStep.id}`}
          height="100%"
          language="javascript"
          value={initialCode.js}
          onChange={setLocalJs}
          theme="vs-dark"
        />
      </Split>
      <div className="preview-pane">
        <PreviewPane html={localHtml} css={localCss} js={localJs} />
      </div>
    </Split>
  );
});

// const Workspace = observer(({ project, currentStep }) => {
// 	const { projectStore } = useStore();
  
// 	// 1. "УМНЫЙ" useMemo ДЛЯ ОПРЕДЕЛЕНИЯ СТАРТОВОГО КОДА
// 	// Он будет пересчитываться каждый раз при смене шага (currentStep).
// 	const initialCode = useMemo(() => {
// 	  // Защита, если на первом рендере еще нет данных
// 	  if (!currentStep || !project.steps) {
// 		return { html: "", css: "", js: "" };
// 	  }
  
// 	  // Сначала ищем сохраненный код для ТЕКУЩЕГО шага
// 	  const userCodeForCurrentStep = project.userCodes?.find(
// 		(code) => code.step_id === currentStep.id
// 	  );
  
// 	  // Если нашли - отлично, используем его
// 	  if (userCodeForCurrentStep) {
// 		console.log(`Загружен сохраненный код для шага ${currentStep.id}`);
// 		return {
// 		  html: userCodeForCurrentStep.html,
// 		  css: userCodeForCurrentStep.css,
// 		  js: userCodeForCurrentStep.js,
// 		};
// 	  }
	  
// 	  // Если кода для текущего шага нет, ищем код для ПРЕДЫДУЩЕГО
// 	  const currentStepIndex = project.steps.findIndex(step => step.id === currentStep.id);
// 	  if (currentStepIndex > 0) {
// 		const prevStep = project.steps[currentStepIndex - 1];
// 		const userCodeForPrevStep = project.userCodes?.find(
// 		  (code) => code.step_id === prevStep.id
// 		);
// 		// Если у предыдущего шага есть сохраненный код - переносим его на текущий
// 		if (userCodeForPrevStep) {
// 		  console.log(`Код для текущего шага не найден. Переносим код с предыдущего шага ${prevStep.id}`);
// 		  return {
// 			html: userCodeForPrevStep.html,
// 			css: userCodeForPrevStep.css,
// 			js: userCodeForPrevStep.js,
// 		  };
// 		}
// 	  }
  
// 	  // В самом крайнем случае (первый шаг, прогресса нет) - используем стартовые шаблоны проекта
// 	  console.log(`Прогресс не найден. Используются стартовые шаблоны проекта.`);
// 	  return {
// 		html: project.html_template ?? "",
// 		css: project.css_template ?? "",
// 		js: project.js_template ?? "",
// 	  };
  
// 	}, [project, currentStep]); // Пересчитываем только когда меняется проект или шаг
  
// 	// Локальное состояние для редакторов
// 	const [localHtml, setLocalHtml] = useState(initialCode.html);
// 	const [localCss, setLocalCss] = useState(initialCode.css);
// 	const [localJs, setLocalJs] = useState(initialCode.js);
  
// 	// 2. useEffect для СИНХРОНИЗАЦИИ редакторов при смене шага
// 	// Этот хук - ключ к обновлению редакторов при клике на "Вперед"/"Назад".
// 	useEffect(() => {
// 	  setLocalHtml(initialCode.html);
// 	  setLocalCss(initialCode.css);
// 	  setLocalJs(initialCode.js);
// 	}, [initialCode]); // Зависимость от initialCode гарантирует, что при его изменении редакторы обновятся
  
// 	// 3. Сохраняем debounce, но используем его только для обновления глобального стора.
// 	// Это снижает количество ре-рендеров других компонентов.
// 	const [debouncedHtml] = useDebounce(localHtml, 300);
// 	const [debouncedCss] = useDebounce(localCss, 300);
// 	const [debouncedJs] = useDebounce(localJs, 300);
  
// 	// useEffect'ы, которые обновляют глобальный стор MobX.
// 	// Это нужно, чтобы `handleCheck` в родительском компоненте имел доступ к свежему коду.
// 	useEffect(() => { projectStore.updateCode("html", debouncedHtml); }, [debouncedHtml, projectStore]);
// 	useEffect(() => { projectStore.updateCode("css", debouncedCss); }, [debouncedCss, projectStore]);
// 	useEffect(() => { projectStore.updateCode("javascript", debouncedJs); }, [debouncedJs, projectStore]);
  
// 	// useEffect для АВТОСОХРАНЕНИЯ мы удалили, так как сохранение теперь происходит по кнопке.
  
// 	return (
// 	  <Split
// 		direction="vertical"
// 		style={{ display: "flex", flexDirection: "column", height: "100vh" }}
// 		sizes={[50, 50]}
// 	  >
// 		<Split className="split-editors" sizes={[33, 33, 34]}>
// 		  <Editor
// 			height="100%"
// 			language="html"
// 			value={localHtml}
// 			onChange={setLocalHtml}
// 			theme="vs-dark"
// 		  />
// 		  <Editor
// 			height="100%"
// 			language="css"
// 			value={localCss}
// 			onChange={setLocalCss}
// 			theme="vs-dark"
// 		  />
// 		  <Editor
// 			height="100%"
// 			language="javascript"
// 			value={localJs}
// 			onChange={setLocalJs}
// 			theme="vs-dark"
// 		  />
// 		</Split>
// 		<div className="preview-pane">
// 		  {/* 4. ИСПРАВЛЕНИЕ: Превью теперь использует локальные, мгновенные значения */}
// 		  <PreviewPane html={localHtml} css={localCss} js={localJs} />
// 		</div>
// 	  </Split>
// 	);
//   });

// --- Основной Компонент Страницы ---
const ProjectPage = observer(() => {
  const { projectStore } = useStore();
  const { id } = useParams();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        await projectStore.fetchProject(id);

        // Инициализация пройденных шагов
        if (projectStore.currentProject?.userProgresses) {
          const completedIds = projectStore.currentProject.userProgresses
            .filter((p) => p.completed)
            .map((p) => p.step_id);
          setCompletedSteps(new Set(completedIds));
        }

        // Сброс индекса при загрузке нового проекта
        setCurrentStepIndex(0);
      }
    };
    loadData();
  }, [id, projectStore]); // Зависимость только от id и стора

  // ЕДИНСТВЕННЫЙ useEffect для обработки результата проверки
  useEffect(() => {
    if (projectStore.validationResult?.success) {
      const currentStepId =
        projectStore.currentProject?.steps[currentStepIndex]?.id;
      const projectId = projectStore.currentProject?.id;

      if (currentStepId && projectId) {
        // Обновляем локальный Set
        setCompletedSteps((prev) => new Set(prev).add(currentStepId));
        // Сохраняем прогресс на бэкенд
        projectStore.markStepAsCompleted(projectId, currentStepId);
      }

      // Логика авто-переключения
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
