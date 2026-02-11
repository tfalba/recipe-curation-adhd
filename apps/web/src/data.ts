import type { Ingredient, StepData } from "./components/types";

export const steps: StepData[] = [
  {
    title: "Sear the chicken",
    bullets: [
      "Pat dry, season with salt + pepper.",
      "Sear 3 minutes per side until golden.",
      "Move to plate, keep drippings.",
    ],
    chips: ["6 min", "Medium heat", "Skillet"],
    timerSeconds: 360,
    needsNow: [
      { label: "Chicken thighs", type: "ingredient" },
      { label: "Olive oil", type: "ingredient" },
      { label: "Skillet", type: "other" },
      { label: "Tongs", type: "other" },
    ],
    nextPreview: ["Saute garlic", "Whisk in broth + lemon", "Simmer briefly"],
    summary: "Sear chicken until golden, then set aside.",
  },
  {
    title: "Build the sauce",
    bullets: [
      "Saute garlic 30 seconds until fragrant.",
      "Whisk in broth + lemon zest.",
      "Simmer until glossy, about 3 minutes.",
    ],
    chips: ["5 min", "Low heat", "Whisk"],
    timerSeconds: 300,
    needsNow: [
      { label: "Garlic", type: "ingredient" },
      { label: "Lemon zest", type: "ingredient" },
      { label: "Broth", type: "ingredient" },
      { label: "Whisk", type: "other" },
    ],
    nextPreview: ["Return chicken", "Spoon sauce over", "Top with parsley"],
    summary: "Whisk together lemony sauce until glossy.",
  },
  {
    title: "Finish and serve",
    bullets: ["Return chicken to pan.", "Spoon sauce over.", "Top with parsley."],
    chips: ["2 min", "Warm", "Tongs"],
    timerSeconds: 120,
    needsNow: [
      { label: "Chicken", type: "ingredient" },
      { label: "Parsley", type: "ingredient" },
      { label: "Serving plates", type: "other" },
    ],
    nextPreview: ["Serve", "Enjoy"],
    summary: "Finish with sauce and herbs, then serve.",
  },
];

export const ingredients: Ingredient[] = [
  { name: "Chicken thighs", qty: "1.5 lb", note: "patted dry" },
  { name: "Olive oil", qty: "2 tbsp", note: "divided" },
  { name: "Garlic", qty: "3 cloves", note: "minced" },
  { name: "Chicken broth", qty: "1 cup", note: "low sodium" },
  { name: "Lemon", qty: "1", note: "zest + juice" },
  { name: "Parsley", qty: "2 tbsp", note: "chopped" },
];

export const quickFixes = [
  "Split long steps",
  "Convert to bullets",
  "Normalize units",
  "Highlight times/temps",
];
