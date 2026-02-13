export type Ingredient = {
  name: string;
  qty: string;
  note: string;
};

export type NeedsNowItem = {
  item: string | Ingredient;
  type: "ingredient" | "other";
};

export type BulletPart =
  | { type: "text"; value: string }
  | { type: "ingredient"; ingredient: Ingredient };

export type StepBullet = {
  parts: BulletPart[];
};

export type StepData = {
  title: string;
  bullets: StepBullet[];
  chips: string[];
  timerSeconds: number;
  needsNow: NeedsNowItem[];
  ingredients: Ingredient[];
  nextPreview: string[];
  summary: string;
};

export type RecipePayload = {
  recipeTitle: string;
  ingredients: Ingredient[];
  steps: StepData[];
};

export type RecipeSource = "generated" | "library" | "none";
