import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Dummy API routes for DataFlow ML
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/upload", (req, res) => {
    // Simulate upload and initial analysis
    setTimeout(() => {
      res.json({
        datasetId: "ds_" + Math.random().toString(36).substring(7),
        rows: 4521,
        cols: 12,
        anomalies: 122,
        duplicates: 45
      });
    }, 1500);
  });

  app.post("/api/clean", (req, res) => {
    // Simulate AI cleaning
    setTimeout(() => {
      res.json({
        status: "success",
        cleanedRows: 4476,
        fixes: {
          duplicatesRemoved: 45,
          missingValuesFilled: 18,
          formatsCorrected: 59
        }
      });
    }, 2500);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
