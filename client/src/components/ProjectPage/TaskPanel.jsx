/**
 * @file components/ProjectPage/TaskPanel.jsx
 * @description Левая панель с инструкциями для текущего шага.
 */
import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import ProjectAssets from "./ProjectAssets";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TaskPanel = observer(({ project, currentStep, onCheck }) => {
  const { projectStore } = useStore();

  if (!currentStep) {
    return <div className="task-panel">Загрузка задания...</div>;
  }

  return (
    <div className="task-panel">
      <div className="task-content">
        <h2>Шаг {currentStep.order}</h2>

        {/* Заменяем <p> на ReactMarkdown */}
        <div className="instructions">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Стилизация inline кода
              code: ({  inline,  children, ...props }) => {
                return inline ? (
                  <code
                    style={{
                      background: "#f5f5f5",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "0.9em",
                      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                      color: "#d63384",
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <pre
                    style={{
                      background: "#f8f9fa",
                      padding: "12px",
                      borderRadius: "6px",
                      overflow: "auto",
                      border: "1px solid #e9ecef",
                      margin: "10px 0",
                    }}
                  >
                    <code
                      style={{
                        fontFamily:
                          'Monaco, Consolas, "Courier New", monospace',
                        fontSize: "0.9em",
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  </pre>
                );
              },
              // Стилизация заголовков
              h1: ({ children }) => (
                <h1
                  style={{
                    color: "#212529",
                    marginBottom: "16px",
                    fontSize: "1.5em",
                  }}
                >
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2
                  style={{
                    color: "#495057",
                    marginBottom: "12px",
                    fontSize: "1.3em",
                  }}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  style={{
                    color: "#6c757d",
                    marginBottom: "10px",
                    fontSize: "1.1em",
                  }}
                >
                  {children}
                </h3>
              ),
              // Стилизация списков
              ul: ({ children }) => (
                <ul style={{ paddingLeft: "20px", marginBottom: "12px" }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol style={{ paddingLeft: "20px", marginBottom: "12px" }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: "4px", lineHeight: "1.5" }}>
                  {children}
                </li>
              ),
              // Стилизация параграфов
              p: ({ children }) => (
                <p style={{ marginBottom: "12px", lineHeight: "1.6" }}>
                  {children}
                </p>
              ),
              // Стилизация жирного текста
              strong: ({ children }) => (
                <strong style={{ color: "#495057", fontWeight: "600" }}>
                  {children}
                </strong>
              ),
              // Стилизация блок-цитат
              blockquote: ({ children }) => (
                <blockquote
                  style={{
                    borderLeft: "4px solid #007bff",
                    paddingLeft: "16px",
                    margin: "16px 0",
                    fontStyle: "italic",
                    color: "#6c757d",
                  }}
                >
                  {children}
                </blockquote>
              ),
            }}
          >
            {currentStep.instructions}
          </ReactMarkdown>
        </div>

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

      {/* Файлы проекта */}
      <ProjectAssets assets={project?.assets} />
    </div>
  );
});

export default TaskPanel;

// /**
//  * @file components/ProjectPage/TaskPanel.jsx
//  * @description Левая панель с инструкциями для текущего шага.
//  */
// import React from "react";
// import { observer } from "mobx-react-lite";
// import { useStore } from "../../hooks/useStore";
// import ProjectAssets from "./ProjectAssets";

// const TaskPanel = observer(({ project, currentStep, onCheck }) => {
//   const { projectStore } = useStore();

//   if (!currentStep) {
//     return <div className="task-panel">Загрузка задания...</div>;
//   }

//   return (
//     <div className="task-panel">
//       <div className="task-content">
//         <h2>Шаг {currentStep.order}</h2>
//         <p>{currentStep.instructions}</p>

//         {/* Кнопка проверки */}
//         <button
//           onClick={onCheck}
//           className="check-btn"
//           disabled={projectStore.isChecking}
//         >
//           {projectStore.isChecking ? "Проверка..." : "Проверить"}
//         </button>

//         {/* Отображение результата проверки */}
//         {projectStore.validationResult && (
//           <div
//             className={
//               projectStore.validationResult.success ? "success" : "error"
//             }
//             style={{ marginTop: "1rem" }}
//           >
//             {projectStore.validationResult.success ? (
//               <p>{projectStore.validationResult.message}</p>
//             ) : (
//               projectStore.validationResult.errors.map((err, i) => (
//                 <p key={i}>{err}</p>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {/* Файлы проекта */}
//       <ProjectAssets assets={project?.assets} />
//     </div>
//   );
// });

// export default TaskPanel;
