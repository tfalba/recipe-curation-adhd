import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OTHER_KEYWORDS = [
  "whisk",
  "foil",
  "dish",
  "rimmed baking sheet",
  "spatula",
  "tongs",
  "skillet",
  "pan",
  "pot",
  "sheet pan",
  "baking sheet",
  "bowl",
  "knife",
  "cutting board",
  "oven",
  "stove",
  "stovetop",
  "microwave",
  "air fryer",
  "grill",
  "thermometer",
  "timer",
  "heat",
  "medium heat",
  "low heat",
  "high heat",
  "preheat",
  "degree",
  "degrees",
  "f",
  "c",
];

const looksLikeOther = (label: string) => {
  const normalized = label.toLowerCase();
  if (/\d+\s?(f|c)\b/.test(normalized)) {
    return true;
  }
  return OTHER_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

// Minimal placeholder endpoint — you’ll replace schema/prompting in Codex
app.post("/api/transform", async (req: Request, res: Response) => {
  try {
    const recipeText = typeof req.body?.recipeText === "string" ? req.body.recipeText : null;
    if (!recipeText) {
      return res.status(400).json({ error: "recipeText is required" });
    }

    // Server-side OpenAI call so OPENAI_API_KEY never hits the client.
    // Use JSON mode to ensure the response parses, then validate shape.
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "You are a helpful assistant that outputs JSON only. " +
        "Return a JSON object with keys: recipeTitle (string), ingredients (array), and steps (array). " +
        "Each ingredient: { qty: string, name: string, note: string }. " +
        "Each step: { title: string, bullets: string[], chips: string[], timerSeconds: number, needsNow: { label: string, type: \"ingredient\" | \"other\" }[], ingredients: Ingredient[], nextPreview: string[], summary: string }. " +
        "Classify needsNow.type as \"ingredient\" for edible items from the ingredient list, and \"other\" for tools, cookware, appliances, temperatures, timers, and techniques. " +
        "Include in step.ingredients the subset of the global ingredients used in that step. " +
        "Examples of other: whisk, skillet, oven, 350F, medium heat, timer.",
      input:
        "Convert the recipe into structured ingredients and short chunked steps. " +
        "Respond with JSON only.\n\n" +
        recipeText,
      text: {
        format: { type: "json_object" },
      },
    });

    const raw = response.output_text ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: "OpenAI returned invalid JSON." });
    }

    const data = parsed as {
      recipeTitle?: unknown;
      ingredients?: unknown;
      steps?: unknown;
    };

    if (!Array.isArray(data.ingredients) || !Array.isArray(data.steps)) {
      return res.status(500).json({ error: "OpenAI response missing steps or ingredients." });
    }

    const recipeTitle =
      typeof data.recipeTitle === "string" && data.recipeTitle.trim().length > 0
        ? data.recipeTitle.trim()
        : "Untitled recipe";

    const ingredients = data.ingredients
      .filter((item) => typeof item === "object" && item !== null)
      .map((item) => {
        const candidate = item as { qty?: unknown; name?: unknown; note?: unknown };
        return {
          qty: typeof candidate.qty === "string" ? candidate.qty : "",
          name: typeof candidate.name === "string" ? candidate.name : "",
          note: typeof candidate.note === "string" ? candidate.note : "",
        };
      })
      .filter((item) => item.name.trim().length > 0);

    const steps = data.steps
      .filter((item) => typeof item === "object" && item !== null)
      .map((item) => {
        const candidate = item as {
          title?: unknown;
          bullets?: unknown;
          chips?: unknown;
          timerSeconds?: unknown;
          needsNow?: unknown;
          ingredients?: unknown;
          nextPreview?: unknown;
          summary?: unknown;
        };

        const needsNow = Array.isArray(candidate.needsNow)
          ? candidate.needsNow
              .map((entry) => {
                if (typeof entry === "string") {
                  return {
                    label: entry,
                    type: looksLikeOther(entry) ? ("other" as const) : ("ingredient" as const),
                  };
                }
                if (typeof entry === "object" && entry !== null) {
                  const need = entry as { label?: unknown; type?: unknown };
                  const label = typeof need.label === "string" ? need.label : "";
                  const rawType = typeof need.type === "string" ? need.type : "";
                  const type = rawType === "ingredient" ? "ingredient" : "other";
                  const inferredType = label ? (looksLikeOther(label) ? "other" : "ingredient") : type;
                  return { label, type: inferredType };
                }
                return { label: "", type: "other" as const };
              })
              .filter((entry) => entry.label.trim().length > 0)
          : [];

        const stepIngredients = Array.isArray(candidate.ingredients)
          ? candidate.ingredients
              .filter((entry) => typeof entry === "object" && entry !== null)
              .map((entry) => {
                const ing = entry as { qty?: unknown; name?: unknown; note?: unknown };
                return {
                  qty: typeof ing.qty === "string" ? ing.qty : "",
                  name: typeof ing.name === "string" ? ing.name : "",
                  note: typeof ing.note === "string" ? ing.note : "",
                };
              })
              .filter((entry) => entry.name.trim().length > 0)
          : [];

        return {
          title: typeof candidate.title === "string" ? candidate.title : "",
          bullets: Array.isArray(candidate.bullets)
            ? candidate.bullets.filter((b) => typeof b === "string")
            : [],
          chips: Array.isArray(candidate.chips)
            ? candidate.chips.filter((c) => typeof c === "string")
            : [],
          timerSeconds:
            typeof candidate.timerSeconds === "number" && Number.isFinite(candidate.timerSeconds)
              ? Math.max(0, Math.round(candidate.timerSeconds))
              : 0,
          needsNow,
          ingredients: stepIngredients,
          nextPreview: Array.isArray(candidate.nextPreview)
            ? candidate.nextPreview.filter((n) => typeof n === "string")
            : [],
          summary: typeof candidate.summary === "string" ? candidate.summary : "",
        };
      })
      .filter((step) => step.title.trim().length > 0);

    if (ingredients.length === 0 || steps.length === 0) {
      return res.status(500).json({ error: "OpenAI response missing usable steps or ingredients." });
    }

    res.json({ recipeTitle, ingredients, steps });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

const port = Number(process.env.PORT || 10000);
app.listen(port, () => console.log(`API listening on ${port}`));
