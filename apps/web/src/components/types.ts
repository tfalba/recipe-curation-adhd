export type ViewKey =
  | "overview"
  | "processing"
  | "review"
  | "cook"
  | "library"
  | "settings";

export type StepData = {
  title: string;
  bullets: string[];
  chips: string[];
  timerSeconds: number;
  needsNow: { label: string; type: "ingredient" | "other" }[];
  nextPreview: string[];
  summary: string;
};

export type Ingredient = {
  name: string;
  qty: string;
  note: string;
};

export type TimerItem = {
  id: string;
  label: string;
  remainingSeconds: number;
  running: boolean;
};
