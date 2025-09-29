import React, { useState, useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";
//import brazeLogo from "public/braze-high-resolution-logo-cropped.svg"; 

export default function FullPageMonaco({
  initialValueLeft = `int printf(const char *format, ...);\n\nint main() {\n  printf("Hello from braze!");\n}\n\n\n/*\nFeature list:\n1. Local and global variables of primitive type: char, int, short, long, void. R and L values are supported.\n2. Function declarations, function prototypes and function calls, all with parameters\n3. String support\n4. Most operators are implemented, but not logical operators( && and ||) and bitwise operators (>> and <<)\n5. if, else if and else statements is upported\n6. while loop is supported, break and continue statement do not work\n7. for loop is supported, break and continue statement do not work\n  * Init part of the for loop must contain a variable declaration. Condition and loop part must be present.\n6. pointer arithmentic is supported\n\nKnown limitations:\n1. No pre processor support, include doesn't work. In order to use Printf, declare the following prototype at the top of the file, and nasm will link it: \"int printf(const char *format, ...);\" \n2. Format specifiers in strings is not supported, example: \"test value %d\", 10\n3. Return keyword is not suppoerted\n4. Following controll flow constructs are supported like: do while, goto\n5. No pointer arithmentic is supported \n5. No structs, typedef or complex types are supported\n6. Single line bodies are not supported {} must be used\n7. Global variables must be declared before the first function definition\n\nTo see examples of implemented language features goto: /unit_test/test_files/codegeneration/";\n*/`,
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

  const handleToolchainChange = useCallback((event) => {
  const selectedToolchain = event.target.value;
  console.log("Selected toolchain:", selectedToolchain);

  fetch("http://localhost:4000/toolchain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toolchain: selectedToolchain }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Toolchain response:", data);
    })
    .catch((err) => console.error("Error:", err));
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
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
        }}
      >
        {/* Logo */}
        <img
          src="/braze-high-resolution-logo-cropped.svg"
          alt="Braze Compiler Logo"
          style={{ height: "30px" }}
        />

        {/* Dropdown + Label */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px", color: "white" }}>Toolchain:</span>
          <select
            style={{
              backgroundColor: "#333",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onChange={handleToolchainChange}
          >
            <option value="braze">Braze.Compiler</option>
            <option value="gcc">todo: add other toolchains</option>
          </select>
        </div>
      </div>


      {/* Divider line */}
      <div
        style={{
          borderBottom: "2px solid #333",
          margin: "0 0 0px 0",
        }}
      ></div>

      {/* Editor Grid */}
      <div
        className="h-screen w-screen grid grid-cols-2"
        style={{
          height: "calc(100vh - 60px)",
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
