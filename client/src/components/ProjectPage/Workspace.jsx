import React, { useMemo, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useDebounce } from "use-debounce";
import { useStore } from "../../hooks/useStore";
import Split from "react-split";
// Импортируйте редакторы, если они используются, например:
import Editor from "@monaco-editor/react";
import PreviewPane from "./PreviewPane";

const Workspace = observer(({ project, currentStep }) => {
  const { projectStore } = useStore();

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

  // Локальное состояние редакторов
  const [localHtml, setLocalHtml] = useState(initialCode.html);
  const [localCss, setLocalCss] = useState(initialCode.css);
  const [localJs, setLocalJs] = useState(initialCode.js);

  // Debounce для обновления глобального стора
  const [debouncedHtml] = useDebounce(localHtml, 300);
  const [debouncedCss] = useDebounce(localCss, 300);
  const [debouncedJs] = useDebounce(localJs, 300);

  useEffect(() => {
    projectStore.updateCode("html", debouncedHtml);
  }, [debouncedHtml, projectStore]);
  useEffect(() => {
    projectStore.updateCode("css", debouncedCss);
  }, [debouncedCss, projectStore]);
  useEffect(() => {
    projectStore.updateCode("js", debouncedJs);
  }, [debouncedJs, projectStore]);

  // Сброс локального состояния при смене шага
  useEffect(() => {
    setLocalHtml(initialCode.html);
    setLocalCss(initialCode.css);
    setLocalJs(initialCode.js);
  }, [initialCode]);

  return (
    <Split
      direction="vertical"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      sizes={[50, 50]}
    >
      <Split className="split-editors" sizes={[33, 33, 34]}>
        {/*
			--- КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: ДОБАВЛЯЕМ KEY К РЕДАКТОРАМ ---
			Мы создаем уникальный ключ для каждого редактора, зависящий от ID шага.
			Когда ID шага меняется, React уничтожает старый <Editor> и создает новый,
			который гарантированно возьмет новое значение из `value`.
		  */}
        <Editor
          key={`html-${currentStep.id}`}
          height="100%"
          language="html"
          value={initialCode.html} // Используем defaultValue для инициализации
          onChange={setLocalHtml}
          theme="vs-dark"
        />
        <Editor
          key={`css-${currentStep.id}`}
          height="100%"
          language="css"
          value={initialCode.css}
          onChange={setLocalCss}
          theme="vs-dark"
        />
        <Editor
          key={`javascript-${currentStep.id}`}
          height="100%"
          language="javascript"
          value={initialCode.js}
          onChange={setLocalJs}
          theme="vs-dark"
        />
      </Split>
      <div className="preview-pane">
        <PreviewPane html={localHtml} css={localCss} js={localJs} />
      </div>
    </Split>
  );
});

export default Workspace;