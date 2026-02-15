import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import OpenAI from "openai";
import type {
  BulletPart,
  Ingredient,
  NeedsNowItem,
  RecipeSummary,
  StepBullet,
  StepData,
} from "@rc/types";
import multer from "multer";
import pdfParse from "pdf-parse";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://recipe-curation-genius.vercel.app",
  "http://localhost:5173",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const upload = multer();

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

app.post("/api/parse", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "file is required" });
    }
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are supported." });
    }
    const parsed = await pdfParse(file.buffer);
    const recipeText = parsed.text?.trim() ?? "";
    if (!recipeText) {
      return res.status(400).json({ error: "No text could be extracted from PDF." });
    }
    return res.json({ recipeText });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unable to parse PDF.";
    return res.status(500).json({ error: message });
  }
});

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
        "Return a JSON object with keys: recipeTitle (string), recipeSummary (object), ingredients (array), and steps (array). " +
        "recipeSummary: { servings: string, prepTime: string, cookTime: string }. " +
        "Each ingredient: { qty: string, name: string, note: string }. " +
        "Each step: { title: string, bullets: { parts: { type: \"text\", value: string } | { type: \"ingredient\", ingredient: Ingredient }[] }[], chips: string[], timerSeconds: number, needsNow: { item: string | Ingredient, type: \"ingredient\" | \"other\" }[], ingredients: Ingredient[], nextPreview: string[], summary: string }. " +
        "Classify needsNow.type as \"ingredient\" for edible items from the ingredient list, and \"other\" for tools, cookware, appliances, temperatures, timers, and techniques. " +
        "For needsNow.item, use an Ingredient object when it matches an ingredient, otherwise use a string. " +
        "Include in step.ingredients the subset of the global ingredients used in that step. " +
        "When a bullet mentions an ingredient, represent that mention as a part with type \"ingredient\" and the ingredient object; all other text should be type \"text\". " +
        "If a step is broad, split it into substeps and keep at most 3 bullets per step. " +
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
      recipeSummary?: unknown;
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

    const ingredients: Ingredient[] = data.ingredients
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

    const recipeSummarySource =
      typeof data.recipeSummary === "object" && data.recipeSummary !== null
        ? (data.recipeSummary as {
            servings?: unknown;
            prepTime?: unknown;
            cookTime?: unknown;
            totalTime?: unknown;
            activeTime?: unknown;
          })
        : null;

    const recipeSummary: RecipeSummary = {
      servings:
        typeof recipeSummarySource?.servings === "string" &&
        recipeSummarySource.servings.trim().length > 0
          ? recipeSummarySource.servings
          : "4 servings",
      prepTime:
        typeof recipeSummarySource?.prepTime === "string" &&
        recipeSummarySource.prepTime.trim().length > 0
          ? recipeSummarySource.prepTime
          : typeof recipeSummarySource?.activeTime === "string" &&
              recipeSummarySource.activeTime.trim().length > 0
            ? recipeSummarySource.activeTime
            : "10 min",
      cookTime:
        typeof recipeSummarySource?.cookTime === "string" &&
        recipeSummarySource.cookTime.trim().length > 0
          ? recipeSummarySource.cookTime
          : typeof recipeSummarySource?.totalTime === "string" &&
              recipeSummarySource.totalTime.trim().length > 0
            ? recipeSummarySource.totalTime
            : "20 min",
    };

    const steps: StepData[] = data.steps
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

        const needsNow: NeedsNowItem[] = Array.isArray(candidate.needsNow)
          ? candidate.needsNow
              .map((entry) => {
                if (typeof entry === "string") {
                  return {
                    item: entry,
                    type: looksLikeOther(entry)
                      ? ("other" as const)
                      : ("ingredient" as const),
                  };
                }
                if (typeof entry === "object" && entry !== null) {
                  const need = entry as { item?: unknown; type?: unknown };
                  const rawType = typeof need.type === "string" ? need.type : "";
                  const type = rawType === "ingredient" ? "ingredient" : "other";

                  if (typeof need.item === "string") {
                    const inferredType = looksLikeOther(need.item)
                      ? ("other" as const)
                      : ("ingredient" as const);
                    return { item: need.item, type: inferredType };
                  }

                  if (typeof need.item === "object" && need.item !== null) {
                    const ing = need.item as { qty?: unknown; name?: unknown; note?: unknown };
                    const ingredient = {
                      qty: typeof ing.qty === "string" ? ing.qty : "",
                      name: typeof ing.name === "string" ? ing.name : "",
                      note: typeof ing.note === "string" ? ing.note : "",
                    };
                    return {
                      item: ingredient,
                      type: ingredient.name ? ("ingredient" as const) : ("other" as const),
                    };
                  }
                }
                return { item: "", type: "other" as const };
              })
              .filter((entry) => {
                if (typeof entry.item === "string") {
                  return entry.item.trim().length > 0;
                }
                return entry.item.name.trim().length > 0;
              })
          : [];

        const stepIngredients: Ingredient[] = Array.isArray(candidate.ingredients)
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

        const ingredientMap = new Map(
          ingredients
            .filter((ingredient) => ingredient.name.trim().length > 0)
            .map((ingredient) => [ingredient.name.toLowerCase(), ingredient])
        );

        const ingredientNames = Array.from(ingredientMap.keys()).sort(
          (a, b) => b.length - a.length
        );
        const ingredientPattern =
          ingredientNames.length > 0
            ? new RegExp(
                `(${ingredientNames
                  .map((name) => name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"))
                  .join("|")})`,
                "gi"
              )
            : null;

        const toStructuredParts = (text: string): BulletPart[] => {
          if (!ingredientPattern) {
            return [{ type: "text", value: text } as BulletPart];
          }
          const parts = text.split(ingredientPattern);
          return parts
            .map((part, index) => {
              if (index % 2 === 1) {
                const ingredient = ingredientMap.get(part.toLowerCase());
                if (ingredient) {
                  return { type: "ingredient", ingredient } as BulletPart;
                }
              }
              return { type: "text", value: part } as BulletPart;
            })
            .filter((part) =>
              part.type === "ingredient" || (part.value ?? "").trim() !== ""
            );
        };

        const normalizeBullet = (bullet: unknown): StepBullet | null => {
          if (typeof bullet === "string") {
            return { parts: toStructuredParts(bullet) };
          }
          if (typeof bullet === "object" && bullet !== null) {
            const b = bullet as { parts?: unknown };
            if (Array.isArray(b.parts)) {
              const parts = b.parts
                .map((part) => {
                  if (typeof part === "string") {
                    return { type: "text", value: part } as BulletPart;
                  }
                  if (typeof part === "object" && part !== null) {
                    const p = part as { type?: unknown; value?: unknown; ingredient?: unknown };
                    if (p.type === "text" && typeof p.value === "string") {
                      return { type: "text", value: p.value } as BulletPart;
                    }
                    if (p.type === "ingredient" && typeof p.ingredient === "object" && p.ingredient !== null) {
                      const ing = p.ingredient as { qty?: unknown; name?: unknown; note?: unknown };
                      const ingredient = {
                        qty: typeof ing.qty === "string" ? ing.qty : "",
                        name: typeof ing.name === "string" ? ing.name : "",
                        note: typeof ing.note === "string" ? ing.note : "",
                      };
                      if (ingredient.name.trim().length > 0) {
                        return { type: "ingredient", ingredient } as BulletPart;
                      }
                    }
                  }
                  return null;
                })
                .filter((part): part is BulletPart => part !== null);
              const normalized = parts.flatMap((part) =>
                part.type === "text" ? toStructuredParts(part.value ?? "") : [part]
              );
              return { parts: normalized };
            }
          }
          return null;
        };

        const bullets: StepBullet[] = Array.isArray(candidate.bullets)
          ? candidate.bullets
              .map(normalizeBullet)
              .filter((bullet): bullet is StepBullet => Boolean(bullet && bullet.parts.length))
              .slice(0, 3)
          : [];

        return {
          title: typeof candidate.title === "string" ? candidate.title : "",
          bullets,
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

    res.json({ recipeTitle, recipeSummary, ingredients, steps });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

const port = Number(process.env.PORT || 10000);
app.listen(port, () => console.log(`API listening on ${port}`));
