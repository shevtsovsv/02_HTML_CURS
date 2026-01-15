/**
 * @file components/ProjectPage/PreviewPane.jsx
 * @description Компонент с iframe для отображения результата кода.
 */
import React, { useMemo, useRef, useEffect } from "react";

const PreviewPane = ({ html, css, js, onConsoleMessage }) => {
  const iframeRef = useRef(null);

  const documentContent = useMemo(() => {
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

          // Выполняем пользовательский код в изолированной среде
          (function() {
            try {
              ${js || ""}
            } catch (e) {
              console.error('Ошибка выполнения кода:', e.message || e);
            }
          })();
        } catch (initError) {
          // Игнорируем ошибки инициализации
        }
      });
    `;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${css || ""}</style>
        </head>
        <body>
          ${html || ""}
          <script>${safeJs}</script>
        </body>
      </html>
    `;
  }, [html, css, js]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={documentContent}
      title="preview"
      sandbox="allow-scripts allow-popups allow-forms"
      width="100%"
      height="100%"
      style={{ 
        border: "none", 
        backgroundColor: "#fff",
        isolation: "isolate" 
      }}
    />
  );
};

export default PreviewPane;
