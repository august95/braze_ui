import express from "express";
import cors from "cors"; 
import { execFile } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const BINARY_PATH = path.join(__dirname, "../bin/braze");
// Global state for toolchain

let currentToolchain = null;

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/run", async (req, res) => {
  try {
    const code = req.body.code;

    execFile(BINARY_PATH, ["--input_code", code], async (error, stdout, stderr) => {
      if (error) {
        console.log("Binary execution error:\n", stderr || error.message);
        return res.status(500).json({ error: stderr || error.message });
      }
      try {
        res.json({ output: stdout });
      } catch (readErr) {
        //console.log("Failed to read assembly output:\n", readErr.message);
        res.status(500).json({ error: "Failed to read assembly output: " + readErr.message });
      }
    });
  } catch (err) {
    console.log("Unexpected server error:\n", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/toolchain", async (req, res) => {
  const toolchain = req.body.toolchain;
  console.log("Toolchain set to:", toolchain);
  try {
    if (!toolchain) {
      return res.status(400).json({ error: "Missing toolchain value" });
    }
  } catch (err) {
    console.log("Unexpected server error:\n", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
