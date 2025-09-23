import React, { useState, useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";

export default function FullPageMonaco({
  initialValueLeft = `int main() {\n  printf("Hello from left editor!");\n}\n`,
  initialValueRight = `<no assembly generated>`,
  language = "c",
  theme = "vs-dark",
  options = {},
}) {
  const leftEditorRef = useRef(null);
  const rightEditorRef = useRef(null);

  const [leftValue, setLeftValue] = useState(initialValueLeft);
  const [rightValue, setRightValue] = useState(initialValueRight);

  const handleEditorDidMountLeft = useCallback((editor) => {
    leftEditorRef.current = editor;
    editor.focus();
  }, []);

  const handleEditorDidMountRight = useCallback((editor) => {
    rightEditorRef.current = editor;
  }, []);

  const handleChangeLeft = useCallback((value) => {
    // value can be undefined in some typings, guard it
    setLeftValue(value ?? "");
    console.log("left editor value:", value);
  }, []);

  const handleChangeRight = useCallback((value) => {
    setRightValue(value ?? "");
    console.log("right editor value:", value);
  }, []);

  const mergedOptions = {
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    wordWrap: "on",
    ...options,
  };

  return (
    <div
      className="h-screen w-screen grid grid-cols-2"
      style={{
        height: "100vh",
        width: "100vw",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={leftValue}
        theme={theme}
        options={mergedOptions}
        onMount={handleEditorDidMountLeft}
        onChange={handleChangeLeft}
      />

      <Editor
        height="100%"
        width="100%"
        language={language}
        value={rightValue}
        theme={theme}
        options={mergedOptions}
        onMount={handleEditorDidMountRight}
        onChange={handleChangeRight}
      />
    </div>
  );
}
