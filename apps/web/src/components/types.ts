export type {
  BulletPart,
  Ingredient,
  NeedsNowItem,
  RecipePayload,
  RecipeSource,
  StepBullet,
  StepData,
} from "@rc/types";

export type ViewKey =
  | "overview"
  | "processing"
  | "review"
  | "cook"
  | "library"
  | "settings";

export type TimerItem = {
  id: string;
  label: string;
  remainingSeconds: number;
  running: boolean;
};
