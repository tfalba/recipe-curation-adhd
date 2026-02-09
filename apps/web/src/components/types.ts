export type ViewKey =
  | "inbox"
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
  needsNow: string[];
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
