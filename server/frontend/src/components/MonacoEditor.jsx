import React, { useEffect } from "react";

function MonacoEditor({ id, language, defaultValue }) {
  useEffect(() => {
    // Monaco editor loader
    require.config({
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs",
      },
    });
    require(["vs/editor/editor.main"], function () {
      monaco.editor.create(document.getElementById(id), {
        value: defaultValue,
        language: language,
      });
    });
  }, [id, language, defaultValue]);

  return <div id={id} className="editor-container"></div>;
}

export default MonacoEditor;
