import React, { useState, useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";
//import brazeLogo from "public/braze-high-resolution-logo-cropped.svg"; 

export default function FullPageMonaco({
  initialValueLeft = `extern printf(...);\n\nint main() {\n  printf("Hello from braze!");\n}\n`,
  initialValueRight = `section .data\nsection .text\nextern printf\nglobal main\nmain:\npush ebp\nmov ebp, esp\nlea ebx, [printf]\npush ebx\npop ebx\nmov ecx, ebx\nmov eax, str_1\npush eax\ncall ecx\nadd esp, 4\npush eax\npop eax\npush eax\nadd esp, 4\npop ebp\nret\nsection .rodata\nstr_1: db 'H', 'e', 'l', 'l', 'o', ' ', 'f', 'r', 'o', 'm', ' ', 'b', 'r', 'a', 'z', 'e', '!', 0\n`,
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
    fetch("http://localhost:4000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: value }),
    })
      .then((res) => res.json())
      .then((data) => {
        // ...and set it as the value for the right editor.
        // This effectively "clears and pastes" the new content.
        // It uses the 'output' field, or the 'error' field as a fallback.
        setRightValue(data.output || data.error || "");
      })
      .catch((err) => setOutput("Error: " + err.message))
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
    style={{
      backgroundColor: "#181818",
      minHeight: "100vh",
      minWidth: "100vw",
      color: "white",
      fontSize: "18px",
    }}
  >
    <div style={{ padding: "10px" }}>
      <img
        src="/braze-high-resolution-logo-cropped.svg"
        alt="Braze Compiler Logo"
        style={{ height: "30px" }} // Adjust height as needed
      />
    </div>

    {/* Divider line */}
    <div
      style={{
        borderBottom: "2px solid #333", // Thin line
        margin: "0 0 0px 0", // Optional spacing below the line
      }}
    ></div>

    <div
      className="h-screen w-screen grid grid-cols-2"
      style={{
        height: "calc(100vh - 60px)", // Adjust height to account for the header
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
        options={{
          ...mergedOptions,
          fontSize: 16,
        }}
        onMount={handleEditorDidMountLeft}
        onChange={handleChangeLeft}
      />

      <Editor
        height="100%"
        width="100%"
        language={language}
        value={rightValue}
        theme={theme}
        options={{
          ...mergedOptions,
          fontSize: 16,
        }}
        onMount={handleEditorDidMountRight}
        onChange={handleChangeRight}
      />
    </div>
  </div>
);


}
