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

        try {
          ${js || ""}
        } catch (e) {
          console.error('Ошибка выполнения кода в превью:', e.message || e);
        }
      });
    `;
    return `
      <html>
        <head><style>${css || ""}</style></head>
        <body>${html || ""}</body>
        <script>${safeJs}</script>
      </html>
    `;
  }, [html, css, js]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={documentContent}
      title="preview"
      sandbox="allow-scripts"
      width="100%"
      height="100%"
      style={{ border: "none", backgroundColor: "#fff" }}
    />
  );
};

export default PreviewPane;
