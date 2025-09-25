/**
 * @file components/ProjectPage/Workspace.jsx
 * @description Правая панель с редакторами кода (вкладки) и окном превью.
 */
import React, { useMemo, useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import Split from "react-split"; // <-- 1. Импортируем Split
import Editor from "@monaco-editor/react";
import PreviewPane from "./PreviewPane";

const Workspace = observer(({ project, currentStep }) => {
  const { projectStore } = useStore();

  // Новое состояние для отслеживания активной вкладки
  const [activeTab, setActiveTab] = useState("html"); // По умолчанию открыт HTML
  
  // Состояние для консоли
  const [consoleLogs, setConsoleLogs] = useState([]);
  const consoleRef = useRef(null);

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

  useEffect(() => {
    setLocalHtml(initialCode.html);
    setLocalCss(initialCode.css);
    setLocalJs(initialCode.js);
  }, [initialCode]); // Зависимость от initialCode - это ключ к успеху!

  // Карта для удобного сопоставления вкладок и данных
  const editorMapping = {
    html: { value: localHtml, setter: setLocalHtml, language: "html" },
    css: { value: localCss, setter: setLocalCss, language: "css" },
    js: { value: localJs, setter: setLocalJs, language: "javascript" },
  };

  // Функция для добавления сообщения в консоль
  const addConsoleMessage = (message, type = 'log') => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev, { message, type, timestamp }]);
  };

  // Функция для очистки консоли
  const clearConsole = () => {
    setConsoleLogs([]);
  };

  useEffect(() => {
    projectStore.updateCode("html", localHtml);
    projectStore.updateCode("css", localCss);
    projectStore.updateCode("javascript", localJs);
  }, [localHtml, localCss, localJs, projectStore]);

  // Эффект для перехвата console сообщений из preview iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'console') {
        const { method, args } = event.data;
        addConsoleMessage(args.join(' '), method);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Эффект для автоскролла консоли
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLogs]);

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
              // Перехватываем console методы для отправки сообщений в родительское окно
              const originalConsole = {
                log: console.log,
                error: console.error,
                warn: console.warn,
                info: console.info
              };
              
              ['log', 'error', 'warn', 'info'].forEach(method => {
                console[method] = function(...args) {
                  originalConsole[method].apply(console, args);
                  window.parent.postMessage({
                    type: 'console',
                    method: method,
                    args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
                  }, '*');
                };
              });

              document.addEventListener('DOMContentLoaded', function() {
                try { ${localJs} } catch (e) { 
                  console.error(e.message || e); 
                }
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
          <button
            className={`tab-button ${activeTab === "console" ? "active" : ""}`}
            onClick={() => setActiveTab("console")}
          >
            Console
          </button>
        </div>

        {/* Панель с одним активным редактором или консолью */}
        <div className="editor-panes">
          {activeTab === "console" ? (
            <div className="console-pane">
              <div className="console-header">
                <button onClick={clearConsole} className="console-clear-btn">
                  Clear
                </button>
              </div>
              <div className="console-content" ref={consoleRef}>
                {consoleLogs.map((log, index) => (
                  <div key={index} className={`console-message console-${log.type}`}>
                    <span className="console-timestamp">[{log.timestamp}]</span>
                    <span className="console-text">{log.message}</span>
                  </div>
                ))}
                {consoleLogs.length === 0 && (
                  <div className="console-message console-info">
                    <span className="console-text">Console is empty. Run your code to see output.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Editor
              height="100%" // Редактор займет всю высоту панели
              language={editorMapping[activeTab].language}
              value={editorMapping[activeTab].value}
              onChange={editorMapping[activeTab].setter}
              theme="vs-dark"
            />
          )}
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