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
const TEST_FILE_PATH = path.join(__dirname, "../bin/test_file.s");
const ASM_OUTPUT_PATH = path.join(__dirname, "../bin/test_file.s.asm");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/run", async (req, res) => {
  try {
    const code = req.body.code;
    
    // Log the incoming request content
    console.log("Received request with code:\n", code);

    // Step 1: Save input code to test_file.s
    await fs.writeFile(TEST_FILE_PATH, code, "utf8");

    // Step 2: Run the binary
    execFile(BINARY_PATH, [TEST_FILE_PATH], async (error, stdout, stderr) => {
      if (error) {
        console.log("Binary execution error:\n", stderr || error.message);
        return res.status(500).json({ error: stderr || error.message });
      }

      try {
        // Step 3: Read the resulting .c.asm file
        const asmContent = await fs.readFile(ASM_OUTPUT_PATH, "utf8");
        
        // Log the response content
        console.log("Sending response with output:\n", asmContent);

        res.json({ output: asmContent });
      } catch (readErr) {
        console.log("Failed to read assembly output:\n", readErr.message);
        res.status(500).json({ error: "Failed to read assembly output: " + readErr.message });
      }
    });
  } catch (err) {
    console.log("Unexpected server error:\n", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/toolchain", async (req, res) => {
  console.log("Toolchain set to:", currentToolchain);
  try {
    const toolchain = req.body.toolchain;
    if (!toolchain) {
      return res.status(400).json({ error: "Missing toolchain value" });
    }

    currentToolchain = toolchain;

    res.json({ message: "Toolchain updated", toolchain: currentToolchain });
  } catch (err) {
    console.log("Unexpected server error:\n", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
