import React, { useState, useEffect } from "react";
import MonacoEditor from "react-monaco-editor";

export default function TwoPaneEditors() {
  const [theme, setTheme] = useState("vs-dark");
  const [userCode, setUserCode] = useState("// Type here, this is the LEFT editor\n");
  const [serverCode, setServerCode] = useState("// Server output will appear here in the RIGHT editor\n");

  // Simulate server writing code periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setServerCode((prev) => prev + "\n// Server says: " + new Date().toLocaleTimeString());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const editorOptions = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Two Editors Playground</h1>
          <button
            className="px-3 py-1 rounded bg-white dark:bg-gray-800 border"
            onClick={() => setTheme((t) => (t === "vs-dark" ? "vs" : "vs-dark"))}
          >
            Toggle Theme
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: "80vh" }}>
          {/* Left editor */}
          <div className="bg-white dark:bg-gray-800 rounded shadow p-2 flex flex-col min-h-0">
            <h2 className="text-gray-700 dark:text-gray-200 mb-2">Left Editor (User)</h2>
            <div className="flex-1 min-h-0">
              <MonacoEditor
                height={1024}
                language="javascript"
                theme={theme}
                value={userCode}
                options={editorOptions}
                onChange={(v) => setUserCode(v)}
              />
            </div>
          </div>

          {/* Right editor */}
          <div className="bg-white dark:bg-gray-800 rounded shadow p-2 flex flex-col min-h-0">
            <h2 className="text-gray-700 dark:text-gray-200 mb-2">Right Editor (Server)</h2>
            <div className="flex-1 min-h-0">
              <MonacoEditor
                height={1024}
                language="javascript"
                theme={theme}
                value={serverCode}
                options={{ ...editorOptions, readOnly: true }}
              />
            </div>
          </div>
        </div>


        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Left editor is editable. Right editor simulates server output every 5 seconds.
        </div>
      </div>
    </div>
  );
}
