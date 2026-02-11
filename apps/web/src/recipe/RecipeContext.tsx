import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Ingredient, StepData } from "../components";
import { ingredientsLemonChicken as seedIngredients, stepsLemonChicken as seedSteps } from "../data";

type RecipeStatus = "idle" | "loading" | "success" | "error";

type RecipeContextValue = {
  recipeText: string;
  setRecipeText: (value: string) => void;
  steps: StepData[];
  ingredients: Ingredient[];
  status: RecipeStatus;
  error: string | null;
  generateFromText: () => Promise<void>;
  setSteps: (steps: StepData[]) => void;
  setIngredients: (ingredients: Ingredient[]) => void;
};

const RecipeContext = createContext<RecipeContextValue | null>(null);

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:10000";

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipeText, setRecipeText] = useState("");
  const [steps, setSteps] = useState<StepData[]>(seedSteps);
  const [ingredients, setIngredients] = useState<Ingredient[]>(seedIngredients);
  const [status, setStatus] = useState<RecipeStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const generateFromText = useCallback(async () => {
    if (!recipeText.trim()) {
      setError("Paste a recipe before generating.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/transform`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeText }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to generate recipe.");
      }

      if (
        !Array.isArray(payload?.steps) ||
        payload.steps.length === 0 ||
        !Array.isArray(payload?.ingredients) ||
        payload.ingredients.length === 0
      ) {
        throw new Error("OpenAI response was missing steps or ingredients.");
      }

      setSteps(payload.steps);
      setIngredients(payload.ingredients);
      setStatus("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setStatus("error");
    }
  }, [recipeText]);

  const value = useMemo<RecipeContextValue>(
    () => ({
      recipeText,
      setRecipeText,
      steps,
      ingredients,
      status,
      error,
      generateFromText,
      setSteps,
      setIngredients,
    }),
    [recipeText, steps, ingredients, status, error, generateFromText]
  );

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
}

export function useRecipe() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within RecipeProvider.");
  }
  return context;
}
