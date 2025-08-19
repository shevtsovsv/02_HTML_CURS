/**
 * @file components/ProjectPage/Workspace.jsx
 * @description Правая панель с редакторами кода (вкладки) и окном превью.
 */
import React, { useMemo, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import Split from "react-split"; // <-- 1. Импортируем Split
import Editor from "@monaco-editor/react";
import PreviewPane from "./PreviewPane";

const Workspace = observer(({ project, currentStep }) => {
  const { projectStore } = useStore();

  // Новое состояние для отслеживания активной вкладки
  const [activeTab, setActiveTab] = useState("html"); // По умолчанию открыт HTML

  // Ваша логика вычисления initialCode
  const initialCode = useMemo(() => {
    if (!currentStep || !project.steps) return { html: "", css: "", js: "" };

    const userCodeForCurrentStep = project.userCodes?.find(
      (code) => code.step_id === currentStep.id
    );
    if (
      userCodeForCurrentStep &&
      (userCodeForCurrentStep.html ||
        userCodeForCurrentStep.css ||
        userCodeForCurrentStep.js)
    ) {
      return {
        html: userCodeForCurrentStep.html,
        css: userCodeForCurrentStep.css,
        js: userCodeForCurrentStep.js,
      };
    }

    const currentStepIndex = project.steps.findIndex(
      (step) => step.id === currentStep.id
    );
    if (currentStepIndex > 0) {
      const prevStep = project.steps[currentStepIndex - 1];
      const userCodeForPrevStep = project.userCodes?.find(
        (code) => code.step_id === prevStep.id
      );
      if (
        userCodeForPrevStep &&
        (userCodeForPrevStep.html ||
          userCodeForPrevStep.css ||
          userCodeForPrevStep.js)
      ) {
        return {
          html: userCodeForPrevStep.html,
          css: userCodeForPrevStep.css,
          js: userCodeForPrevStep.js,
        };
      }
    }

    return {
      html: project.html_template ?? "",
      css: project.css_template ?? "",
      js: project.js_template ?? "",
    };
  }, [project, currentStep]);

  const [localHtml, setLocalHtml] = useState(initialCode.html);
  const [localCss, setLocalCss] = useState(initialCode.css);
  const [localJs, setLocalJs] = useState(initialCode.js);

  // Карта для удобного сопоставления вкладок и данных
  const editorMapping = {
    html: { value: localHtml, setter: setLocalHtml, language: "html" },
    css: { value: localCss, setter: setLocalCss, language: "css" },
    js: { value: localJs, setter: setLocalJs, language: "javascript" },
  };

  useEffect(() => {
    projectStore.updateCode("html", localHtml);
    projectStore.updateCode("css", localCss);
    projectStore.updateCode("javascript", localJs);
  }, [localHtml, localCss, localJs, projectStore]);



    const handleOpenPreview = () => {
      const newWindow = window.open(); // Открываем пустую вкладку
      if (newWindow) {
        // Собираем полный HTML-документ
        const documentContent = `
        <html>
          <head>
            <title>Превью: ${project.title || "Проект"}</title>
            <style>${localCss}</style>
          </head>
          <body>
            ${localHtml}
            <script>
              document.addEventListener('DOMContentLoaded', function() {
                try { ${localJs} } catch (e) { console.error(e); }
              });
            </script>
          </body>
        </html>
      `;
        // Записываем контент в новую вкладку
        newWindow.document.write(documentContent);
        newWindow.document.close(); // Завершаем запись, чтобы браузер отрендерил страницу
      } else {
        alert(
          "Не удалось открыть новую вкладку. Возможно, она была заблокирована вашим браузером."
        );
      }
    };

  return (
    <Split
      className="right-panel"
      direction="vertical"
      sizes={[60, 40]} // Редакторы занимают 60%, превью - 40%
      minSize={100}
      gutterSize={10}
    >
      <div className="editor-area">
        {/* Вкладки для переключения */}
        <div className="editor-tabs">
          <button
            className={`tab-button ${activeTab === "html" ? "active" : ""}`}
            onClick={() => setActiveTab("html")}
          >
            HTML
          </button>
          <button
            className={`tab-button ${activeTab === "css" ? "active" : ""}`}
            onClick={() => setActiveTab("css")}
          >
            CSS
          </button>
          <button
            className={`tab-button ${activeTab === "js" ? "active" : ""}`}
            onClick={() => setActiveTab("js")}
          >
            JS
          </button>
        </div>

        {/* Панель с одним активным редактором */}
        <div className="editor-panes">
          <Editor
            height="100%" // Редактор займет всю высоту панели
            language={editorMapping[activeTab].language}
            value={editorMapping[activeTab].value}
            onChange={editorMapping[activeTab].setter}
            theme="vs-dark"
          />
        </div>
      </div>

      <div className="preview-panel">
        <button onClick={handleOpenPreview} className="open-preview-btn">
          Открыть в новой вкладке
        </button>
        <PreviewPane html={localHtml} css={localCss} js={localJs} />
      </div>
    </Split>
  );
});

export default Workspace;