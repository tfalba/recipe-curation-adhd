import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/health", (_req, res) => res.json({ ok: true }));

// Minimal placeholder endpoint — you’ll replace schema/prompting in Codex
app.post("/api/transform", async (req, res) => {
  try {
    const { recipeText } = req.body ?? {};
    if (!recipeText || typeof recipeText !== "string") {
      return res.status(400).json({ error: "recipeText is required" });
    }

    // Example call — keep it server-side so OPENAI_API_KEY never hits the client
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Turn this recipe into: (1) structured ingredients, (2) short chunked steps.\n\n${recipeText}`
    });

    res.json({ output: response.output_text });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Unknown error" });
  }
});

const port = Number(process.env.PORT || 10000);
app.listen(port, () => console.log(`API listening on ${port}`));
