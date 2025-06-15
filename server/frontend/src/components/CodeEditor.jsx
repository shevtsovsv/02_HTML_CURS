import React, { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";

const CodeEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = monaco.editor.create(editorRef.current, {
        value,
        language: "html",
        theme: "vs-dark",
        automaticLayout: true,
      });

      editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());
      });

      return () => editor.dispose();
    }
  }, [value, onChange]);

  return <div ref={editorRef} style={{ height: "500px" }} />;
};

export default CodeEditor;
