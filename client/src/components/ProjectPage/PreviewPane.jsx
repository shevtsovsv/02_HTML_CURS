/**
 * @file components/ProjectPage/PreviewPane.jsx
 * @description Компонент с iframe для отображения результата кода.
 */
import React, { useMemo, useRef, useEffect, useState } from "react";

const PreviewPane = ({
  html,
  css,
  js,
  onConsoleMessage,
  forceUpdate = false,
}) => {
  const iframeRef = useRef(null);

  // Состояния для debounced кода
  const [debouncedHtml, setDebouncedHtml] = useState(html);
  const [debouncedCss, setDebouncedCss] = useState(css);
  const [debouncedJs, setDebouncedJs] = useState(js);
  const debounceTimeoutRef = useRef(null);

  // Debounce эффект для JavaScript кода
  useEffect(() => {
    // HTML и CSS обновляем сразу (обычно не вызывают ошибки при промежуточных состояниях)
    setDebouncedHtml(html);
    setDebouncedCss(css);

    // JavaScript обновляем с задержкой, если не принудительное обновление
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (forceUpdate) {
      // При принудительном обновлении (например, при валидации) обновляем сразу
      setDebouncedJs(js);
    } else {
      // Обычное обновление с задержкой
      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedJs(js);
      }, 200); // Уменьшаем задержку до 200мс для лучшей отзывчивости
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [html, css, js, forceUpdate]);

  const documentContent = useMemo(() => {
    // Функция для обертывания JS кода, чтобы функции были доступны глобально для onclick
    const wrapJavaScript = (jsCode) => {
      if (!jsCode) return "";
      
      // Находим все function declarations в коде
      const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
      const functionNames = [];
      let match;
      
      while ((match = functionRegex.exec(jsCode)) !== null) {
        functionNames.push(match[1]);
      }
      
      // Отладочный вывод
      if (functionNames.length > 0) {
        console.log('[PreviewPane] Найдены функции для wrapper:', functionNames);
      }
      
      // Создаем код, который делает функции глобальными
      let globalAssignments = '';
      if (functionNames.length > 0) {
        globalAssignments = '\n// Делаем функции доступными для onclick\n';
        functionNames.forEach(name => {
          globalAssignments += `if (typeof ${name} !== 'undefined') window.${name} = ${name};\n`;
        });
      }
      
      const result = jsCode + globalAssignments;
      
      // Выводим обернутый код для отладки
      if (globalAssignments) {
        console.log('[PreviewPane] Код с wrapper:\n', result);
      }
      
      return result;
    };

    const wrappedJs = wrapJavaScript(debouncedJs);

    const safeJs = `
      document.addEventListener('DOMContentLoaded', function() {
        // Создаем изолированную среду для консоли
        try {
          // Перехватываем console методы для отправки сообщений в родительское окно
          const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
          };
          
          ['log', 'error', 'warn', 'info'].forEach(method => {
            console[method] = function(...args) {
              try {
                originalConsole[method].apply(console, args);
                if (window.parent && window.parent !== window) {
                  window.parent.postMessage({
                    type: 'console',
                    method: method,
                    args: args.map(arg => {
                      try {
                        return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                      } catch (e) {
                        return '[Объект не может быть преобразован]';
                      }
                    })
                  }, '*');
                }
              } catch (postError) {
                // Игнорируем ошибки отправки сообщений
              }
            };
          });

          // Защищаем от ошибок внешних скриптов
          window.addEventListener('error', function(e) {
            e.stopPropagation();
            console.error('Ошибка в превью:', e.message);
          });
        } catch (initError) {
          // Игнорируем ошибки инициализации
        }
      });

      // Выполняем пользовательский код в ГЛОБАЛЬНОМ контексте (вне IIFE)
      // Это необходимо для работы onclick с function declarations
      try {
        ${wrappedJs || ""}
      } catch (e) {
        console.error('Ошибка выполнения кода:', e.message || e);
      }
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${debouncedCss || ""}</style>
        </head>
        <body>
          ${debouncedHtml || ""}
          <script>${safeJs}</script>
        </body>
      </html>
    `;
  }, [debouncedHtml, debouncedCss, debouncedJs]);

  // Отладочный вывод финального HTML
  useEffect(() => {
    console.log('[PreviewPane] Final HTML length:', documentContent.length);
    // Можно раскомментировать для полного просмотра HTML
    // console.log('[PreviewPane] Full HTML:', documentContent);
  }, [documentContent]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={documentContent}
      title="preview"
      sandbox="allow-scripts allow-modals allow-popups allow-forms"
      width="100%"
      height="100%"
      style={{
        border: "none",
        backgroundColor: "#fff",
        isolation: "isolate",
      }}
    />
  );
};

export default PreviewPane;
