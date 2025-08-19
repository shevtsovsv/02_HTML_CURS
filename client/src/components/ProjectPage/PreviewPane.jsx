/**
 * @file components/ProjectPage/PreviewPane.jsx
 * @description Компонент с iframe для отображения результата кода.
 */
import React, { useMemo } from "react";

const PreviewPane = ({ html, css, js }) => {
  const documentContent = useMemo(() => {
    const safeJs = `
      document.addEventListener('DOMContentLoaded', function() {
        try {
          ${js || ""}
        } catch (e) {
          console.error('Ошибка выполнения кода в превью:', e);
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
