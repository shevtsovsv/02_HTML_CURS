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
		// const TaskPanel = observer(() => {
		//   const { projectStore } = useStore();
		//   const [currentStepIndex, setCurrentStepIndex] = useState(0);

		//   // Если проект еще не загружен, компонент не должен пытаться ничего делать.
		//   // Мы можем вернуть null или заглушку.
		//   if (!projectStore.currentProject || !projectStore.currentProject.steps) {
		//     return <div>Загрузка шагов...</div>; // или просто return null;
		//   }
		//   // ----------------------------------------------------

		//   const { steps } = projectStore.currentProject;

		//   // Убедимся, что у нас есть шаги и индекс не выходит за пределы массива
		//   if (steps.length === 0 || !steps[currentStepIndex]) {
		//     return <div>В этом проекте нет шагов.</div>;
		//   }

		//   const currentStep = steps[currentStepIndex];

		// //   const handleCheck = () => {
		// //     projectStore.checkStep(projectId, currentStep.id);
		// //   };

		//   // Создаем ОДИН обработчик для главной кнопки "Проверить"
		//   const handleCheckAndProceed = () => {
		//     // Вызываем ЕДИНСТВЕННЫЙ правильный метод из стора
		//     projectStore.checkAndProceed(currentStep.id);
		//   };

		//   const goToNextStep = () => {
		//     if (currentStepIndex < steps.length - 1) {
		//       setCurrentStepIndex(currentStepIndex + 1);
		//       projectStore.validationResult = null; // Сбрасываем результат проверки при переключении
		//     }
		//   };

		//   const goToPrevStep = () => {
		//     if (currentStepIndex > 0) {
		//       setCurrentStepIndex(currentStepIndex - 1);
		//       projectStore.validationResult = null; // Сбрасываем результат
		//     }
		//   };
		

		//   return (
		//     // <div className="task-panel">
		//     //   {/* Навигация по шагам */}
		//     //   <div
		//     //     style={{
		//     //       display: "flex",
		//     //       justifyContent: "space-between",
		//     //       alignItems: "center",
		//     //       marginBottom: "20px",
		//     //     }}
		//     //   >
		//     //     <button onClick={goToPrevStep} disabled={currentStepIndex === 0}>
		//     //       ← Назад
		//     //     </button>
		//     //     <span>
		//     //       Шаг {currentStepIndex + 1} из {steps.length}
		//     //     </span>
		//     //     <button
		//     //       onClick={goToNextStep}
		//     //       disabled={currentStepIndex === steps.length - 1}
		//     //     >
		//     //       Вперед →
		//     //     </button>
		//     //   </div>
		//     //   <h3>{currentStep.title || `Шаг ${currentStep.step_number}}`}</h3>
		//     //   {/* <p>{currentStep.instructions}</p> */}
		//     //   <p>{currentStep.description}</p>{" "}
		//     //   {/* Заменил instructions на description */}
		//     //   <button
		//     //     onClick={handleCheckAndProceed}
		//     //     disabled={projectStore.isChecking}
		//     //   >
		//     //     {projectStore.isChecking ? "Проверка..." : "Проверить и перейти"}
		//     //   </button>
		//     //   {/* Отображение результата проверки */}
		//     //   {projectStore.validationResult && (
		//     //     <div
		//     //       className={
		//     //         projectStore.validationResult.success ? "success" : "error"
		//     //       }
		//     //     >
		//     //       {projectStore.validationResult.success ? (
		//     //         <p>Отлично! Переходим к следующему шагу...</p>
		//     //       ) : (
		//     //         <ul>
		//     //           {projectStore.validationResult.errors.map((error, index) => (
		//     //             <li key={index}>{error}</li>
		//     //           ))}
		//     //         </ul>
		//     //       )}
		//     //     </div>
		//     //   )}
		//     // </div>
		//     <div className="task-panel">
		//       {/* Навигация по шагам (локальная) */}
		//       <div
		//         style={{
		//           display: "flex",
		//           justifyContent: "space-between",
		//           alignItems: "center",
		//           marginBottom: "20px",
		//         }}
		//       >
		//         <button onClick={goToPrevStep} disabled={currentStepIndex === 0}>
		//           ← Назад
		//         </button>
		//         <span>
		//           Шаг {currentStepIndex + 1} из {steps.length}
		//         </span>
		//         <button
		//           onClick={goToNextStep}
		//           disabled={currentStepIndex === steps.length - 1}
		//         >
		//           Вперед →
		//         </button>
		//       </div>

		//       {/* Описание задания */}
		//       <h3>{currentStep.title || `Шаг ${currentStep.step_number}`}</h3>
		//       <p>{currentStep.description}</p>

		//       {/* Главная кнопка действия */}
		//       <button
		//         onClick={handleCheckAndProceed}
		//         disabled={projectStore.isChecking}
		//       >
		//         {projectStore.isChecking ? "Проверка..." : "Проверить"}
		//       </button>

		//       {/* Результат проверки */}
		//       {projectStore.validationResult && (
		//         <div
		//           className={
		//             projectStore.validationResult.success ? "success" : "error"
		//           }
		//         >
		//           {projectStore.validationResult.success ? (
		//             <p>Отлично! Можно переходить к следующему шагу.</p>
		//           ) : (
		//             <ul>
		//               {projectStore.validationResult.errors.map((error, index) => (
		//                 <li key={index}>{error}</li>
		//               ))}
		//             </ul>
		//           )}
		//         </div>
		//       )}
		//     </div>
		//   );
		// });

		const TaskPanel = observer(
      ({
        currentStep,
        currentStepIndex,
        totalSteps,
        onNext,
        onPrev,
        onCheck,
      }) => {
        const { projectStore } = useStore();

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
                disabled={currentStepIndex === totalSteps - 1}
              >
                Вперед →
              </button>
            </div>

            {/* ИСПРАВЛЕНИЕ: Убрана лишняя фигурная скобка */}
            <h3>{currentStep.title || `Шаг ${currentStep.step_number}`}</h3>
            <p>{currentStep.description}</p>

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

// --- Основной Компонент Страницы ---
		// const ProjectPage = observer(() => {
		//   const { projectStore } = useStore();
		//   const { id } = useParams();

		//   useEffect(() => {
		//     if (id) {
		//       projectStore.fetchProject(id);
		//     }
		//   }, [id, projectStore]);

		//   if (projectStore.isLoading || !projectStore.currentProject) {
		//     return <div>Загрузка проекта...</div>;
		//   }
		//   return <Workspace project={projectStore.currentProject} />;
		// });
// --- Основной Компонент Страницы ---
const ProjectPage = observer(() => {
    const { projectStore } = useStore();
    const { id } = useParams();
    
    // ИЗМЕНЕНИЕ: Состояние для индекса текущего шага теперь здесь
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        if (id) {
            projectStore.fetchProject(id);
        }
    }, [id]);

    if (projectStore.isLoading || !projectStore.currentProject) {
        return <div>Загрузка проекта...</div>;
    }
    
    const project = projectStore.currentProject;

    // Защита, если шаги еще не загрузились
    if (!project.steps || project.steps.length === 0) {
        return <div>В этом проекте нет шагов.</div>;
    }
    
    // Определяем текущий шаг здесь
    const currentStep = project.steps[currentStepIndex];
    
    // Функции для навигации
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
    
    // Функция для проверки
    const handleCheck = () => {
        if (currentStep) {
            projectStore.checkAndProceed(currentStep.id);
        }
    };
    
    // ИЗМЕНЕНИЕ: Компоненты получают все нужные данные через пропсы
    return (
        <Split className="split-container" sizes={[30, 70]} minSize={200}>
            <TaskPanel 
                currentStep={currentStep}
                currentStepIndex={currentStepIndex}
                totalSteps={project.steps.length}
                onNext={goToNextStep}
                onPrev={goToPrevStep}
                onCheck={handleCheck}
            />
            <Workspace project={project} currentStep={currentStep} />
        </Split>
    );
});

		// const Workspace = observer(({ project }) => {
		//   const { projectStore } = useStore();

		//   //   // Инициализируем локальное состояние прямо из пропсов.
		//   //   // Это безопасно, так как Workspace рендерится только когда `project` уже есть.
		//   //   const [localHtml, setLocalHtml] = useState(
		//   //     project.userCodes[0]?.html || project.html_template || ""
		//   //   );
		//   //   const [localCss, setLocalCss] = useState(
		//   //     project.userCodes[0]?.css || project.css_template || ""
		//   //   );
		//   //   const [localJs, setLocalJs] = useState(
		//   //     project.userCodes[0]?.js || project.js_template || ""
		//   //   );

		//   // --- ИЗМЕНЕНИЕ: Логика инициализации кода. Теперь она более надежна. ---
		//   // Мы используем `useMemo` для вычисления начального состояния,
		//   // чтобы оно не пересчитывалось на каждом рендере.
		//   const initialCode = useMemo(() => {
		//     const userHtml = project.userCodes?.find(
		//       (code) => code.step_id === project.steps[0].id
		//     )?.html;
		//     const userCss = project.userCodes?.find(
		//       (code) => code.step_id === project.steps[0].id
		//     )?.css;
		//     const userJs = project.userCodes?.find(
		//       (code) => code.step_id === project.steps[0].id
		//     )?.js;

		//     return {
		//       html: userHtml ?? project.html_template ?? "",
		//       css: userCss ?? project.css_template ?? "",
		//       js: userJs ?? project.js_template ?? "",
		//     };
		//   }, [project]);

		//   const [localHtml, setLocalHtml] = useState(initialCode.html);
		//   const [localCss, setLocalCss] = useState(initialCode.css);
		//   const [localJs, setLocalJs] = useState(initialCode.js);

		//   const [debouncedHtml] = useDebounce(localHtml, 500);
		//   const [debouncedCss] = useDebounce(localCss, 500);
		//   const [debouncedJs] = useDebounce(localJs, 5000);

		//   // useEffect'ы для обновления стора остаются без изменений
		//   //   useEffect(() => {
		//   //     projectStore.updateCode("html", localHtml);
		//   //   }, [localHtml, projectStore]);
		//   //   useEffect(() => {
		//   //     projectStore.updateCode("css", localCss);
		//   //   }, [localCss, projectStore]);
		//   //   useEffect(() => {
		//   //     projectStore.updateCode("javascript", localJs);
		//   //   }, [localJs, projectStore]);

		//   //   // --- НОВЫЙ useEffect ДЛЯ АВТОСОХРАНЕНИЯ ---
		//   //   useEffect(() => {
		//   //     // Убедимся, что проект загружен и у нас есть что сохранять
		//   //     if (project.id) {
		//   //       // Вызываем сохранение на бэкенд.
		//   //       // Так как мы зависим от debounced-значений, этот эффект
		//   //       // сработает только после паузы в наборе текста.
		//   //       projectStore.saveCode(project.id, {
		//   //         html: debouncedHtml,
		//   //         css: debouncedCss,
		//   //         js: debouncedJs,
		//   //       });
		//   //     }
		//   //   }, [debouncedHtml, debouncedCss, debouncedJs, project.id, projectStore]);
		//   //   useEffect(() => {
		//   //     setLocalHtml(project.userCodes?.[0]?.html || project.html_template || "");
		//   //     setLocalCss(project.userCodes?.[0]?.css || project.css_template || "");
		//   //     setLocalJs(project.userCodes?.[0]?.js || project.js_template || "");
		//   //   }, [project.id]); // Зависимость - ID проекта/шага

		//   // --- ИЗМЕНЕНИЕ: Синхронизация кода со стором ---
		//   useEffect(() => {
		//     projectStore.updateCode("html", localHtml);
		//     projectStore.updateCode("css", localCss);
		//     projectStore.updateCode("javascript", localJs);
		//   }, [localHtml, localCss, localJs, projectStore]);

		//   // --- ИЗМЕНЕНИЕ: Обновление редакторов при смене проекта ---
		//   useEffect(() => {
		//     setLocalHtml(initialCode.html);
		//     setLocalCss(initialCode.css);
		//     setLocalJs(initialCode.js);
		//   }, [project.id, initialCode]);
		//   return (
		//     <Split className="split-container" sizes={[30, 70]} minSize={200}>
		//       <TaskPanel />
		//       <Split
		//         direction="vertical"
		//         style={{ display: "flex", flexDirection: "column", height: "100vh" }}
		//         sizes={[50, 50]}
		//       >
		//         <Split className="split-editors" sizes={[33, 33, 34]}>
		//           <Editor
		//             height="100%"
		//             language="html"
		//             value={localHtml}
		//             onChange={setLocalHtml}
		//             theme="vs-dark"
		//           />
		//           <Editor
		//             height="100%"
		//             language="css"
		//             value={localCss}
		//             onChange={setLocalCss}
		//             theme="vs-dark"
		//           />
		//           <Editor
		//             height="100%"
		//             language="javascript"
		//             value={localJs}
		//             onChange={setLocalJs}
		//             theme="vs-dark"
		//           />
		//         </Split>
		//         <div className="preview-pane">
		//           <PreviewPane
		//             html={debouncedHtml}
		//             css={debouncedCss}
		//             js={debouncedJs}
		//           />
		//         </div>
		//       </Split>
		//     </Split>
		//   );
		// });
const Workspace = observer(({ project, currentStep }) => {
      const { projectStore } = useStore();

      // ИЗМЕНЕНИЕ: Логика теперь зависит от `currentStep`, а не от `project.steps[0]`
      const initialCode = useMemo(() => {
        // Защита, если currentStep еще не определен
        if (!currentStep) return { html: "", css: "", js: "" };

        // Ищем сохраненный код ИМЕННО для ТЕКУЩЕГО шага
        const userCodeForStep = project.userCodes?.find(
          (code) => code.step_id === currentStep.id
        );

        return {
          html: userCodeForStep?.html ?? currentStep.html_template ?? "",
          css: userCodeForStep?.css ?? currentStep.css_template ?? "",
          js: userCodeForStep?.js ?? currentStep.js_template ?? "",
        };
      }, [project, currentStep]); // Зависит от проекта и ТЕКУЩЕГО шага

      const [localHtml, setLocalHtml] = useState(initialCode.html);
      const [localCss, setLocalCss] = useState(initialCode.css);
      const [localJs, setLocalJs] = useState(initialCode.js);

      const [debouncedHtml] = useDebounce(localHtml, 500);
      const [debouncedCss] = useDebounce(localCss, 500);
      const [debouncedJs] = useDebounce(localJs, 1000);

      // Синхронизация кода со стором
      useEffect(() => {
        projectStore.updateCode("html", localHtml);
        projectStore.updateCode("css", localCss);
        projectStore.updateCode("javascript", localJs);
      }, [localHtml, localCss, localJs, projectStore]);

      // Обновление редакторов при смене ШАГА
      useEffect(() => {
        setLocalHtml(initialCode.html);
        setLocalCss(initialCode.css);
        setLocalJs(initialCode.js);
      }, [currentStep, initialCode]); // Теперь зависит от `currentStep`

      return (
        <Split className="split-container" sizes={[30, 70]} minSize={200}>
          {/* ИЗМЕНЕНИЕ: Передаем в TaskPanel колбэки и данные из ProjectPage */}
          <TaskPanel
            currentStep={currentStep}
            currentStepIndex={project.steps.findIndex(
              (s) => s.id === currentStep.id
            )}
            totalSteps={project.steps.length}
            onNext={() => {
              /* Будет реализовано в ProjectPage */
            }}
            onPrev={() => {
              /* Будет реализовано в ProjectPage */
            }}
            onCheck={() => projectStore.checkAndProceed(currentStep.id)}
          />
          <Split
            direction="vertical"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
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
