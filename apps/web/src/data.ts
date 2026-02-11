import type { Ingredient, StepData } from "./components/types";

export const recipeTitleLemonChicken = "Lemon Skillet Chicken";
export const stepsLemonChicken: StepData[] = [
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
    ingredients: [
      { name: "Chicken thighs", qty: "1.5 lb", note: "patted dry" },
      { name: "Olive oil", qty: "2 tbsp", note: "divided" },
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
    ingredients: [
      { name: "Garlic", qty: "3 cloves", note: "minced" },
      { name: "Chicken broth", qty: "1 cup", note: "low sodium" },
      { name: "Lemon", qty: "1", note: "zest + juice" },
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
    ingredients: [
      { name: "Chicken thighs", qty: "1.5 lb", note: "patted dry" },
      { name: "Parsley", qty: "2 tbsp", note: "chopped" },
    ],
    nextPreview: ["Serve", "Enjoy"],
    summary: "Finish with sauce and herbs, then serve.",
  },
];

export const recipeTitleMisoNoodles = "Miso Noodles";
export const stepsMisoNoodles: StepData[] = [
  {
    title: "Boil the noodles",
    bullets: [
      "Bring salted water to a boil.",
      "Cook noodles until tender.",
      "Reserve a splash of pasta water.",
    ],
    chips: ["8 min", "High heat", "Pot"],
    timerSeconds: 480,
    needsNow: [
      { label: "Ramen noodles", type: "ingredient" },
      { label: "Pot", type: "other" },
      { label: "Stove", type: "other" },
    ],
    ingredients: [
      { name: "Ramen noodles", qty: "8 oz", note: "fresh or dried" },
    ],
    nextPreview: ["Whisk miso sauce", "Toss noodles", "Top with scallions"],
    summary: "Cook noodles, reserve water for the sauce.",
  },
  {
    title: "Whisk the miso sauce",
    bullets: [
      "Whisk miso, soy, and honey.",
      "Add sesame oil + chili.",
      "Thin with pasta water.",
    ],
    chips: ["3 min", "Low heat", "Whisk"],
    timerSeconds: 180,
    needsNow: [
      { label: "Miso paste", type: "ingredient" },
      { label: "Soy sauce", type: "ingredient" },
      { label: "Honey", type: "ingredient" },
      { label: "Whisk", type: "other" },
    ],
    ingredients: [
      { name: "Miso paste", qty: "2 tbsp", note: "white or yellow" },
      { name: "Soy sauce", qty: "1 tbsp", note: "low sodium" },
      { name: "Honey", qty: "1 tsp", note: "or maple" },
      { name: "Sesame oil", qty: "1 tsp", note: "to finish" },
      { name: "Chili flakes", qty: "1/2 tsp", note: "optional" },
    ],
    nextPreview: ["Toss noodles in sauce", "Add scallions"],
    summary: "Build a quick savory-sweet miso sauce.",
  },
  {
    title: "Toss and serve",
    bullets: [
      "Toss noodles in the sauce.",
      "Top with scallions and sesame.",
      "Serve immediately.",
    ],
    chips: ["2 min", "Low heat", "Tongs"],
    timerSeconds: 120,
    needsNow: [
      { label: "Scallions", type: "ingredient" },
      { label: "Sesame seeds", type: "ingredient" },
      { label: "Tongs", type: "other" },
    ],
    ingredients: [
      { name: "Scallions", qty: "2", note: "thinly sliced" },
      { name: "Sesame seeds", qty: "1 tsp", note: "toasted" },
    ],
    nextPreview: ["Serve", "Enjoy"],
    summary: "Finish with fresh toppings and serve.",
  },
];

export const recipeTitleSheetPanSalmon = "Sheet Pan Salmon";
export const stepsSheetPanSalmon: StepData[] = [
  {
    title: "Prep the pan",
    bullets: [
      "Heat oven to 425F.",
      "Line a sheet pan.",
      "Add salmon and veggies.",
    ],
    chips: ["5 min", "425F", "Sheet pan"],
    timerSeconds: 300,
    needsNow: [
      { label: "Salmon fillets", type: "ingredient" },
      { label: "Broccoli", type: "ingredient" },
      { label: "Sheet pan", type: "other" },
      { label: "425F", type: "other" },
    ],
    ingredients: [
      { name: "Salmon fillets", qty: "4", note: "6 oz each" },
      { name: "Broccoli", qty: "4 cups", note: "bite-size florets" },
      { name: "Olive oil", qty: "2 tbsp", note: "divided" },
    ],
    nextPreview: ["Season salmon", "Roast until flaky"],
    summary: "Get everything on the sheet pan and preheat.",
  },
  {
    title: "Season and roast",
    bullets: [
      "Rub salmon with oil and spices.",
      "Toss broccoli with salt.",
      "Roast 12 minutes.",
    ],
    chips: ["12 min", "Oven", "425F"],
    timerSeconds: 720,
    needsNow: [
      { label: "Lemon", type: "ingredient" },
      { label: "Garlic powder", type: "ingredient" },
      { label: "Oven", type: "other" },
      { label: "Timer", type: "other" },
    ],
    ingredients: [
      { name: "Lemon", qty: "1", note: "sliced" },
      { name: "Garlic powder", qty: "1 tsp", note: "" },
      { name: "Salt", qty: "1 tsp", note: "" },
    ],
    nextPreview: ["Finish with lemon", "Serve"],
    summary: "Roast until salmon flakes and broccoli is tender.",
  },
  {
    title: "Finish and serve",
    bullets: [
      "Squeeze lemon over salmon.",
      "Top with herbs.",
      "Serve hot.",
    ],
    chips: ["2 min", "Warm", "Plates"],
    timerSeconds: 120,
    needsNow: [
      { label: "Fresh dill", type: "ingredient" },
      { label: "Serving plates", type: "other" },
    ],
    ingredients: [
      { name: "Fresh dill", qty: "1 tbsp", note: "chopped" },
    ],
    nextPreview: ["Serve", "Enjoy"],
    summary: "Finish with herbs and lemon, then serve.",
  },
];

export const ingredientsLemonChicken: Ingredient[] = [
  { name: "Chicken thighs", qty: "1.5 lb", note: "patted dry" },
  { name: "Olive oil", qty: "2 tbsp", note: "divided" },
  { name: "Garlic", qty: "3 cloves", note: "minced" },
  { name: "Chicken broth", qty: "1 cup", note: "low sodium" },
  { name: "Lemon", qty: "1", note: "zest + juice" },
  { name: "Parsley", qty: "2 tbsp", note: "chopped" },
];

export const ingredientsMisoNoodles: Ingredient[] = [
  { name: "Ramen noodles", qty: "8 oz", note: "fresh or dried" },
  { name: "Miso paste", qty: "2 tbsp", note: "white or yellow" },
  { name: "Soy sauce", qty: "1 tbsp", note: "low sodium" },
  { name: "Honey", qty: "1 tsp", note: "or maple" },
  { name: "Sesame oil", qty: "1 tsp", note: "to finish" },
  { name: "Chili flakes", qty: "1/2 tsp", note: "optional" },
  { name: "Scallions", qty: "2", note: "thinly sliced" },
  { name: "Sesame seeds", qty: "1 tsp", note: "toasted" },
];

export const ingredientsSheetPanSalmon: Ingredient[] = [
  { name: "Salmon fillets", qty: "4", note: "6 oz each" },
  { name: "Broccoli", qty: "4 cups", note: "bite-size florets" },
  { name: "Olive oil", qty: "2 tbsp", note: "divided" },
  { name: "Lemon", qty: "1", note: "sliced" },
  { name: "Garlic powder", qty: "1 tsp", note: "" },
  { name: "Salt", qty: "1 tsp", note: "" },
  { name: "Fresh dill", qty: "1 tbsp", note: "chopped" },
];

export const libraryRecipes = [
  {
    title: recipeTitleLemonChicken,
    steps: stepsLemonChicken,
    ingredients: ingredientsLemonChicken,
  },
  {
    title: recipeTitleMisoNoodles,
    steps: stepsMisoNoodles,
    ingredients: ingredientsMisoNoodles,
  },
  {
    title: recipeTitleSheetPanSalmon,
    steps: stepsSheetPanSalmon,
    ingredients: ingredientsSheetPanSalmon,
  },
];

export const quickFixes = [
  "Split long steps",
  "Convert to bullets",
  "Normalize units",
  "Highlight times/temps",
];
