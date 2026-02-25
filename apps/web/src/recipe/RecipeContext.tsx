import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Ingredient,
  RecipeSource,
  RecipeSummary,
  StepData,
} from "../components";
import {
  ingredientsClaypotRice as seedIngredients,
  recipeSummaryClaypotRice as seedRecipeSummary,
  recipeTitleClaypotRice as seedTitle,
  stepsClaypotRice as seedSteps,
} from "../data/data";

type RecipeStatus = "idle" | "loading" | "success" | "error";

type RecipeContextValue = {
  recipeText: string;
  setRecipeText: (value: string) => void;
  recipeTitle: string;
  setRecipeTitle: (value: string) => void;
  recipeSummary: RecipeSummary;
  recipeVersion: number;
  hasSelectedRecipe: boolean;
  recipeSource: RecipeSource;
  savedRecipes: {
    title: string;
    recipeSummary: RecipeSummary;
    steps: StepData[];
    ingredients: Ingredient[];
  }[];
  steps: StepData[];
  ingredients: Ingredient[];
  status: RecipeStatus;
  error: string | null;
  generateFromText: () => Promise<void>;
  saveCurrentRecipe: () => boolean;
  deleteSavedRecipe: (title: string) => void;
  applyRecipe: (recipe: {
    title: string;
    recipeSummary?: RecipeSummary;
    steps: StepData[];
    ingredients: Ingredient[];
  }) => void;
  clearRecipeSelection: () => void;
  setSampleRecipeSelection: () => void;
  setSteps: (steps: StepData[]) => void;
  setIngredients: (ingredients: Ingredient[]) => void;
};

const RecipeContext = createContext<RecipeContextValue | null>(null);

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:10000";

const DEFAULT_RECIPE_SUMMARY: RecipeSummary = {
  servings: "4 servings",
  prepTime: "10 min",
  cookTime: "20 min",
};

const normalizeRecipeSummary = (candidate: unknown): RecipeSummary => {
  const source =
    typeof candidate === "object" && candidate !== null
      ? (candidate as {
          servings?: unknown;
          prepTime?: unknown;
          cookTime?: unknown;
          totalTime?: unknown;
          activeTime?: unknown;
        })
      : null;

  return {
    servings:
      typeof source?.servings === "string" && source.servings.trim().length > 0
        ? source.servings
        : DEFAULT_RECIPE_SUMMARY.servings,
    prepTime:
      typeof source?.prepTime === "string" && source.prepTime.trim().length > 0
        ? source.prepTime
        : typeof source?.activeTime === "string" && source.activeTime.trim().length > 0
          ? source.activeTime
          : DEFAULT_RECIPE_SUMMARY.prepTime,
    cookTime:
      typeof source?.cookTime === "string" && source.cookTime.trim().length > 0
        ? source.cookTime
        : typeof source?.totalTime === "string" && source.totalTime.trim().length > 0
          ? source.totalTime
          : DEFAULT_RECIPE_SUMMARY.cookTime,
  };
};

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipeText, setRecipeText] = useState("");
  const [recipeTitle, setRecipeTitle] = useState("Get Started");
  const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>(
    DEFAULT_RECIPE_SUMMARY
  );
  const [recipeVersion, setRecipeVersion] = useState(0);
  const [hasSelectedRecipe, setHasSelectedRecipe] = useState(false);
  const [recipeSource, setRecipeSource] = useState<RecipeSource>("none");
  const [savedRecipes, setSavedRecipes] = useState<
    {
      title: string;
      recipeSummary: RecipeSummary;
      steps: StepData[];
      ingredients: Ingredient[];
    }[]
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
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed
        .filter((recipe): recipe is Record<string, unknown> => {
          return typeof recipe === "object" && recipe !== null;
        })
        .map((recipe) => ({
          title:
            typeof recipe.title === "string" ? recipe.title : "Untitled recipe",
          recipeSummary: normalizeRecipeSummary(recipe.recipeSummary),
          steps: Array.isArray(recipe.steps) ? (recipe.steps as StepData[]) : [],
          ingredients: Array.isArray(recipe.ingredients)
            ? (recipe.ingredients as Ingredient[])
            : [],
        }));
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
      setRecipeSummary(normalizeRecipeSummary(payload?.recipeSummary));
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
        { title: recipeTitle.trim(), recipeSummary, steps, ingredients },
        ...current.filter((recipe) => recipe.title !== recipeTitle.trim()),
      ];
      window.localStorage.setItem("saved-recipes", JSON.stringify(next));
      return next;
    });
    return true;
  }, [recipeTitle, recipeSummary, steps, ingredients]);

  const deleteSavedRecipe = useCallback((title: string) => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      return;
    }

    setSavedRecipes((current) => {
      const next = current.filter((recipe) => recipe.title !== normalizedTitle);
      window.localStorage.setItem("saved-recipes", JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<RecipeContextValue>(
    () => ({
      recipeText,
      setRecipeText,
      recipeTitle,
      setRecipeTitle,
      recipeSummary,
      recipeVersion,
      hasSelectedRecipe,
      recipeSource,
      savedRecipes,
      steps,
      ingredients,
      setSteps,
      setIngredients,
      status,
      error,
      generateFromText,
      saveCurrentRecipe,
      deleteSavedRecipe,
      applyRecipe: (recipe) => {
        setRecipeTitle(recipe.title);
        setRecipeSummary(normalizeRecipeSummary(recipe.recipeSummary));
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
        setRecipeSummary(DEFAULT_RECIPE_SUMMARY);
        setRecipeText("");
        setStatus("idle");
        setError(null);
        setHasSelectedRecipe(false);
        setRecipeSource("none");
      },
      setSampleRecipeSelection: () => {
        setRecipeTitle(seedTitle);
        setRecipeSummary(seedRecipeSummary);
        setSteps(seedSteps);
        setIngredients(seedIngredients);
        setStatus("success");
        setError(null);
        setHasSelectedRecipe(true);
        setRecipeSource("library");
        setRecipeVersion((value) => value + 1);
      },
    }),
    [
      recipeText,
      recipeTitle,
      recipeSummary,
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
      deleteSavedRecipe,
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
