/**
 * @file components/ProjectPage/Workspace.jsx
 * @description Правая панель с редакторами кода (вкладки) и окном превью.
 */
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
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

  // Ref для debounce автосохранения
  const autoSaveTimeout = useRef(null);

  // Ваша логика вычисления initialCode
  const initialCode = useMemo(() => {
    if (!currentStep || !project.steps) return { html: "", css: "", js: "" };

    // Функция для проверки, является ли код "содержательным"
    const hasMeaningfulCode = (code) => {
      return (
        code &&
        code.length > 0 &&
        !code.includes("<!-- Начните с DOCTYPE html -->") &&
        !code.includes("/* Добавьте CSS стили */") &&
        !code.includes("// Добавьте JavaScript")
      );
    };

    // Сначала проверим, есть ли содержательный сохраненный код для ТЕКУЩЕГО шага
    const userCodeForCurrentStep = project.userCodes?.find(
      (code) => code.step_id === currentStep.id
    );

    if (
      userCodeForCurrentStep &&
      (hasMeaningfulCode(userCodeForCurrentStep.html) ||
        hasMeaningfulCode(userCodeForCurrentStep.css) ||
        hasMeaningfulCode(userCodeForCurrentStep.js))
    ) {
      return {
        html: userCodeForCurrentStep.html || "",
        css: userCodeForCurrentStep.css || "",
        js: userCodeForCurrentStep.js || "",
      };
    }

    // Если нет содержательного кода для текущего шага, ищем предыдущие шаги
    const currentStepIndex = project.steps.findIndex(
      (step) => step.id === currentStep.id
    );

    if (currentStepIndex > 0) {
      // Проходим по всем предыдущим шагам от ближайшего к дальнему
      for (let i = currentStepIndex - 1; i >= 0; i--) {
        const prevStep = project.steps[i];
        const userCodeForPrevStep = project.userCodes?.find(
          (code) => code.step_id === prevStep.id
        );

        if (
          userCodeForPrevStep &&
          (hasMeaningfulCode(userCodeForPrevStep.html) ||
            hasMeaningfulCode(userCodeForPrevStep.css) ||
            hasMeaningfulCode(userCodeForPrevStep.js))
        ) {
          return {
            html: userCodeForPrevStep.html || "",
            css: userCodeForPrevStep.css || "",
            js: userCodeForPrevStep.js || "",
          };
        }
      }
    }

    return {
      html: project.html_template ?? "",
      css: project.css_template ?? "",
      js: project.js_template ?? "",
    };
  }, [
    project.id,
    currentStep?.id,
    // Создаем хэш на основе времени последнего обновления userCodes для отслеживания изменений
    project.userCodes
      ? JSON.stringify(
          project.userCodes.map((code) => ({
            step_id: code.step_id,
            htmlLength: code.html?.length || 0,
            cssLength: code.css?.length || 0,
            jsLength: code.js?.length || 0,
          }))
        )
      : "",
  ]);

  const [localHtml, setLocalHtml] = useState(initialCode.html);
  const [localCss, setLocalCss] = useState(initialCode.css);
  const [localJs, setLocalJs] = useState(initialCode.js);
  const [isProgrammaticUpdate, setIsProgrammaticUpdate] = useState(false);

  // Обновление локального состояния при смене initialCode
  useEffect(() => {
    setIsProgrammaticUpdate(true);
    setLocalHtml(initialCode.html || "");
    setLocalCss(initialCode.css || "");
    setLocalJs(initialCode.js || "");
    // Сбрасываем флаг после небольшой задержки
    setTimeout(() => setIsProgrammaticUpdate(false), 100);
  }, [initialCode]);

  // Карта для удобного сопоставления вкладок и данных
  const editorMapping = {
    html: { value: localHtml, setter: setLocalHtml, language: "html" },
    css: { value: localCss, setter: setLocalCss, language: "css" },
    js: { value: localJs, setter: setLocalJs, language: "javascript" },
  };

  // Функция для добавления сообщения в консоль
  const addConsoleMessage = (message, type = "log") => {
    const timestamp = new Date().toLocaleTimeString();
    const id = Date.now() + Math.random(); // Уникальный ID для каждого сообщения
    setConsoleLogs((prev) => [...prev, { id, message, type, timestamp }]);
  };

  // Функция для очистки консоли
  const clearConsole = () => {
    setConsoleLogs([]);
  };

  // Принудительное сохранение перед размонтированием компонента
  const forceSave = useCallback(() => {
    if (!currentStep || !project?.id) return Promise.resolve();

    const codeToSave = {
      html: localHtml,
      css: localCss,
      js: localJs,
    };

    console.log(
      "Принудительное сохранение кода при размонтировании:",
      codeToSave
    );
    return projectStore.saveCode(project.id, currentStep.id, codeToSave);
  }, [currentStep, project?.id, localHtml, localCss, localJs, projectStore]);

  // Debounced автосохранение кода
  const autoSaveCode = useCallback(() => {
    if (!currentStep || !project?.id) {
      return;
    }

    // Очищаем предыдущий таймер
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }

    // Устанавливаем новый таймер на 2 секунды
    autoSaveTimeout.current = setTimeout(async () => {
      const codeToSave = {
        html: localHtml,
        css: localCss,
        js: localJs,
      };

      try {
        // Сохраняем код в фоне, без блокировки интерфейса
        await projectStore.saveCode(project.id, currentStep.id, codeToSave);
      } catch (err) {
        console.error("❌ Ошибка автосохранения:", err);
      }
    }, 2000); // Автосохранение через 2 секунды после последнего изменения
  }, [localHtml, localCss, localJs, currentStep, project, projectStore]);

  useEffect(() => {
    projectStore.updateCode("html", localHtml);
    projectStore.updateCode("css", localCss);
    projectStore.updateCode("javascript", localJs);

    // Запускаем автосохранение только если изменение НЕ программное
    if (!isProgrammaticUpdate) {
      autoSaveCode();
    }
  }, [
    localHtml,
    localCss,
    localJs,
    projectStore,
    autoSaveCode,
    isProgrammaticUpdate,
  ]);

  // Эффект для перехвата console сообщений из preview iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "console") {
        const { method, args } = event.data;
        addConsoleMessage(args.join(" "), method);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
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

  // Cleanup эффект для таймера автосохранения
  useEffect(() => {
    return () => {
      // При размонтировании компонента очищаем таймер автосохранения
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, []); // Пустые зависимости - выполняется только при размонтировании // Зависимость от ID текущего шага

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
                  <div
                    key={index}
                    className={`console-message console-${log.type}`}
                  >
                    <span className="console-timestamp">[{log.timestamp}]</span>
                    <span className="console-text">{log.message}</span>
                  </div>
                ))}
                {consoleLogs.length === 0 && (
                  <div className="console-message console-info">
                    <span className="console-text">
                      Console is empty. Run your code to see output.
                    </span>
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
        <PreviewPane
          html={localHtml}
          css={localCss}
          js={localJs}
          onConsoleMessage={addConsoleMessage}
        />
      </div>
    </Split>
  );
});

export default Workspace;
