import express from "express";
import cors from "cors"; 
import { execFile } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Point to your binary relative to server.js
const BINARY_PATH = path.join(__dirname, "../bin/braze");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/run", (req, res) => {
  const input = req.body.code;
  console.log("Received call from frontend!!");

  const child = execFile(BINARY_PATH, [input], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || error.message });
    }
    res.json({ output: stdout });
  });
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
