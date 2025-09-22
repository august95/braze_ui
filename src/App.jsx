import React, { useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";

// Full-page Monaco Editor React component with side-by-side editors
// Usage: import FullPageMonaco from './FullPageMonaco';
// Make sure to install: npm install @monaco-editor/react monaco-editor

export default function FullPageMonaco({
  initialValueLeft = `int main() {\n  printf("Hello from left editor!");\n}\n`,
  initialValueRight = `<no assembly generated>`,
  language = "c",
  theme = "vs-dark",
  options = {},
}) {
  const leftEditorRef = useRef(null);
  const rightEditorRef = useRef(null);

  const handleEditorDidMountLeft = useCallback((editor, monaco) => {
    leftEditorRef.current = editor;
    editor.focus();
  }, []);

  const handleEditorDidMountRight = useCallback((editor, monaco) => {
    rightEditorRef.current = editor;
  }, []);

  const handleChangeLeft = useCallback((value, event) => {
    // console.log('left editor value:', value);
  }, []);

  const handleChangeRight = useCallback((value, event) => {
    // console.log('right editor value:', value);
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
      style={{ height: "100vh", width: "100vw", display: "grid", gridTemplateColumns: "1fr 1fr" }}
    >
      <Editor
        height="100%"
        width="100%"
        defaultLanguage={language}
        defaultValue={initialValueLeft}
        theme={theme}
        options={mergedOptions}
        onMount={handleEditorDidMountLeft}
        onChange={handleChangeLeft}
      />
      <Editor
        height="100%"
        width="100%"
        defaultLanguage={language}
        defaultValue={initialValueRight}
        theme={theme}
        options={mergedOptions}
        onMount={handleEditorDidMountRight}
        onChange={handleChangeRight}
      />
    </div>
  );
}