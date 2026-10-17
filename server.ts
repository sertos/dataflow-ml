import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

// 1. Agrega esta importación en la parte superior del archivo
import { GoogleGenAI } from "@google/genai";

// ... (tu código existente) ...

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 8080;

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

   // 2. Pega esta nueva ruta antes del bloque "// Vite middleware for development"
  app.post("/api/chat", async (req, res) => {
    try {
      // Recibimos la pregunta y los datos de la tabla desde el frontend
      const { question, datasetContext } = req.body;

      if (!question) {
        return res.status(400).json({ error: "La pregunta es requerida." });
      }

      // Validamos que exista la API Key en las variables de entorno
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("La clave GEMINI_API_KEY no está configurada.");
      }

      // Inicializamos Gemini
      const ai = new GoogleGenAI({ apiKey });

      // Armamos el prompt inyectando los datos de la tabla (datasetContext)
      const systemPrompt = `
Eres un asistente experto en análisis de datos integrado en la plataforma DataFlow ML de Solvra.
Tu objetivo es responder las preguntas del usuario basándote ESTRICTAMENTE en los datos proporcionados a continuación.
Responde de forma clara, directa y en español.

DATOS ACTUALES DEL DATASET:
${datasetContext ? JSON.stringify(datasetContext, null, 2) : "No se proporcionaron datos."}

Pregunta del usuario: "${question}"
      `;

      // Llamamos al modelo (usamos el mismo modelo rápido que tenías en AudioStudio)
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: systemPrompt,
      });

      // Devolvemos la respuesta de Gemini al frontend
      res.json({
        reply: response.text,
      });

    } catch (error: any) {
      console.error("Error en /api/chat:", error);
      res.status(500).json({ 
        error: "Ocurrió un error al consultar a la IA.",
        details: error.message 
      });
    }
  });
  
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // CORRECCIÓN: Usar process.cwd() para buscar la carpeta 'dist' desde la raíz
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start DataFlow ML server:", err);
  process.exit(1);
});

