import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Ingredient, RecipeSource, StepData } from "../components";
import {
  ingredientsClaypotRice as seedIngredients,
  recipeTitleClaypotRice as seedTitle,
  stepsClaypotRice as seedSteps,
} from "../data/data";

type RecipeStatus = "idle" | "loading" | "success" | "error";

type RecipeContextValue = {
  recipeText: string;
  setRecipeText: (value: string) => void;
  recipeTitle: string;
  setRecipeTitle: (value: string) => void;
  recipeVersion: number;
  hasSelectedRecipe: boolean;
  recipeSource: RecipeSource;
  savedRecipes: {
    title: string;
    steps: StepData[];
    ingredients: Ingredient[];
  }[];
  steps: StepData[];
  ingredients: Ingredient[];
  status: RecipeStatus;
  error: string | null;
  generateFromText: () => Promise<void>;
  saveCurrentRecipe: () => boolean;
  applyRecipe: (recipe: {
    title: string;
    steps: StepData[];
    ingredients: Ingredient[];
  }) => void;
  clearRecipeSelection: () => void;
  setSteps: (steps: StepData[]) => void;
  setIngredients: (ingredients: Ingredient[]) => void;
};

const RecipeContext = createContext<RecipeContextValue | null>(null);

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:10000";

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipeText, setRecipeText] = useState("");
  const [recipeTitle, setRecipeTitle] = useState(seedTitle);
  const [recipeVersion, setRecipeVersion] = useState(0);
  const [hasSelectedRecipe, setHasSelectedRecipe] = useState(true);
  const [recipeSource, setRecipeSource] = useState<RecipeSource>("library");
  const [savedRecipes, setSavedRecipes] = useState<
    { title: string; steps: StepData[]; ingredients: Ingredient[] }[]
  >(() => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const stored = window.localStorage.getItem("saved-recipes");
      if (!stored) {
        return [];
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
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

      if (typeof payload?.recipeTitle === "string" && payload.recipeTitle.trim()) {
        setRecipeTitle(payload.recipeTitle.trim());
      }
      setSteps(payload.steps);
      setIngredients(payload.ingredients);
      setStatus("success");
      setHasSelectedRecipe(true);
      setRecipeSource("generated");
      setRecipeVersion((value) => value + 1);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setStatus("error");
    }
  }, [recipeText]);

  const saveCurrentRecipe = useCallback(() => {
    if (!recipeTitle.trim() || steps.length === 0 || ingredients.length === 0) {
      return false;
    }
    setSavedRecipes((current) => {
      const next = [
        { title: recipeTitle.trim(), steps, ingredients },
        ...current.filter((recipe) => recipe.title !== recipeTitle.trim()),
      ];
      window.localStorage.setItem("saved-recipes", JSON.stringify(next));
      return next;
    });
    return true;
  }, [recipeTitle, steps, ingredients]);

  const value = useMemo<RecipeContextValue>(
    () => ({
      recipeText,
      setRecipeText,
      recipeTitle,
      setRecipeTitle,
      recipeVersion,
      hasSelectedRecipe,
      recipeSource,
      savedRecipes,
      steps,
      ingredients,
      status,
      error,
      generateFromText,
      saveCurrentRecipe,
      applyRecipe: (recipe) => {
        setRecipeTitle(recipe.title);
        setSteps(recipe.steps);
        setIngredients(recipe.ingredients);
        setStatus("success");
        setError(null);
        setHasSelectedRecipe(true);
        setRecipeSource("library");
        setRecipeVersion((value) => value + 1);
      },
      clearRecipeSelection: () => {
        setRecipeTitle("Get Started");
        setRecipeText("");
        setStatus("idle");
        setError(null);
        setHasSelectedRecipe(false);
        setRecipeSource("none");
      },
      setSteps,
      setIngredients,
    }),
    [
      recipeText,
      recipeTitle,
      recipeVersion,
      hasSelectedRecipe,
      recipeSource,
      savedRecipes,
      steps,
      ingredients,
      status,
      error,
      generateFromText,
      saveCurrentRecipe,
    ]
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
