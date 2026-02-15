import type {
  BulletPart,
  Ingredient,
  RecipePayload,
  StepBullet,
  StepData,
} from "../components/types";
import { bananaBreadRecipe } from "./bananaBread";
import { recipeClaypotRice } from "./claypotRice";
import { recipeLadyfingers } from "./ladyfingers";
import { recipeShrimpCurry } from "./shrimpCurry";

const textBullets = (bullets: string[]): StepBullet[] =>
  bullets.map((value) => ({
    parts: [{ type: "text", value } as BulletPart],
  }));

const normalizeRecipePayload = (recipe: RecipePayload): RecipePayload => {
  const normalizeParts = (parts: unknown): BulletPart[] => {
    if (!Array.isArray(parts)) {
      return [];
    }
    return parts
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
            return { type: "ingredient", ingredient } as BulletPart;
          }
        }
        return null;
      })
      .filter((part): part is BulletPart => Boolean(part));
  };

  const normalizeBullets = (bullets: unknown): StepBullet[] => {
    if (!Array.isArray(bullets)) {
      return [];
    }
    return bullets
      .map((bullet) => {
        if (typeof bullet === "string") {
          return { parts: textBullets([bullet])[0].parts };
        }
        if (typeof bullet === "object" && bullet !== null) {
          const b = bullet as { parts?: unknown };
          return { parts: normalizeParts(b.parts) };
        }
        return null;
      })
      .filter((bullet): bullet is StepBullet => Boolean(bullet && bullet.parts.length));
  };

  return {
    ...recipe,
    steps: recipe.steps.map((step) => ({
      ...step,
      bullets: normalizeBullets(step.bullets),
    })),
  };
};

export const recipeTitleLemonChicken = "Lemon Skillet Chicken";
export const stepsLemonChicken: StepData[] = [
  {
    title: "Sear the chicken",
    bullets: textBullets([
      "Pat dry, season with salt + pepper.",
      "Sear 3 minutes per side until golden.",
      "Move to plate, keep drippings.",
    ]),
    chips: ["6 min", "Medium heat", "Skillet"],
    timerSeconds: 360,
    needsNow: [
      { item: { name: "Chicken thighs", qty: "1.5 lb", note: "patted dry" }, type: "ingredient" },
      { item: { name: "Olive oil", qty: "2 tbsp", note: "divided" }, type: "ingredient" },
      { item: "Skillet", type: "other" },
      { item: "Tongs", type: "other" },
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
    bullets: textBullets([
      "Saute garlic 30 seconds until fragrant.",
      "Whisk in broth + lemon zest.",
      "Simmer until glossy, about 3 minutes.",
    ]),
    chips: ["5 min", "Low heat", "Whisk"],
    timerSeconds: 300,
    needsNow: [
      { item: { name: "Garlic", qty: "3 cloves", note: "minced" }, type: "ingredient" },
      { item: { name: "Lemon", qty: "1", note: "zest + juice" }, type: "ingredient" },
      { item: { name: "Chicken broth", qty: "1 cup", note: "low sodium" }, type: "ingredient" },
      { item: "Whisk", type: "other" },
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
    bullets: textBullets([
      "Return chicken to pan.",
      "Spoon sauce over.",
      "Top with parsley.",
    ]),
    chips: ["2 min", "Warm", "Tongs"],
    timerSeconds: 120,
    needsNow: [
      { item: { name: "Chicken thighs", qty: "1.5 lb", note: "patted dry" }, type: "ingredient" },
      { item: { name: "Parsley", qty: "2 tbsp", note: "chopped" }, type: "ingredient" },
      { item: "Serving plates", type: "other" },
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
    bullets: textBullets([
      "Bring salted water to a boil.",
      "Cook noodles until tender.",
      "Reserve a splash of pasta water.",
    ]),
    chips: ["8 min", "High heat", "Pot"],
    timerSeconds: 480,
    needsNow: [
      { item: { name: "Ramen noodles", qty: "8 oz", note: "fresh or dried" }, type: "ingredient" },
      { item: "Pot", type: "other" },
      { item: "Stove", type: "other" },
    ],
    ingredients: [
      { name: "Ramen noodles", qty: "8 oz", note: "fresh or dried" },
    ],
    nextPreview: ["Whisk miso sauce", "Toss noodles", "Top with scallions"],
    summary: "Cook noodles, reserve water for the sauce.",
  },
  {
    title: "Whisk the miso sauce",
    bullets: textBullets([
      "Whisk miso, soy, and honey.",
      "Add sesame oil + chili.",
      "Thin with pasta water.",
    ]),
    chips: ["3 min", "Low heat", "Whisk"],
    timerSeconds: 180,
    needsNow: [
      { item: { name: "Miso paste", qty: "2 tbsp", note: "white or yellow" }, type: "ingredient" },
      { item: { name: "Soy sauce", qty: "1 tbsp", note: "low sodium" }, type: "ingredient" },
      { item: { name: "Honey", qty: "1 tsp", note: "or maple" }, type: "ingredient" },
      { item: "Whisk", type: "other" },
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
    bullets: textBullets([
      "Toss noodles in the sauce.",
      "Top with scallions and sesame.",
      "Serve immediately.",
    ]),
    chips: ["2 min", "Low heat", "Tongs"],
    timerSeconds: 120,
    needsNow: [
      { item: { name: "Scallions", qty: "2", note: "thinly sliced" }, type: "ingredient" },
      { item: { name: "Sesame seeds", qty: "1 tsp", note: "toasted" }, type: "ingredient" },
      { item: "Tongs", type: "other" },
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
    bullets: textBullets([
      "Heat oven to 425F.",
      "Line a sheet pan.",
      "Add salmon and veggies.",
    ]),
    chips: ["5 min", "425F", "Sheet pan"],
    timerSeconds: 300,
    needsNow: [
      { item: { name: "Salmon fillets", qty: "4", note: "6 oz each" }, type: "ingredient" },
      { item: { name: "Broccoli", qty: "4 cups", note: "bite-size florets" }, type: "ingredient" },
      { item: "Sheet pan", type: "other" },
      { item: "425F", type: "other" },
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
    bullets: textBullets([
      "Rub salmon with oil and spices.",
      "Toss broccoli with salt.",
      "Roast 12 minutes.",
    ]),
    chips: ["12 min", "Oven", "425F"],
    timerSeconds: 720,
    needsNow: [
      { item: { name: "Lemon", qty: "1", note: "sliced" }, type: "ingredient" },
      { item: { name: "Garlic powder", qty: "1 tsp", note: "" }, type: "ingredient" },
      { item: "Oven", type: "other" },
      { item: "Timer", type: "other" },
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
    bullets: textBullets([
      "Squeeze lemon over salmon.",
      "Top with herbs.",
      "Serve hot.",
    ]),
    chips: ["2 min", "Warm", "Plates"],
    timerSeconds: 120,
    needsNow: [
      { item: { name: "Fresh dill", qty: "1 tbsp", note: "chopped" }, type: "ingredient" },
      { item: "Serving plates", type: "other" },
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

type StepDataText = Omit<StepData, "bullets"> & { bullets: string[] };

const stepsBananaBreadRaw: StepDataText[] =
 [
        {
            "title": "Preheat and prepare pan",
            "bullets": [
                "Position a rack in the center of your oven.",
                "Preheat oven to 350°F (177°C).",
                "Spray a 9x5” loaf pan with non-stick cooking spray or line with parchment paper."
            ],
            "chips": [
                "350°F (177°C)",
                "rack",
                "loaf pan",
                "non-stick cooking spray",
                "parchment paper",
                "oven"
            ],
            "timerSeconds": 0,
            "needsNow": [
                {
                    "item": "350°F (177°C)",
                    "type": "other"
                },
                {
                    "item": "loaf pan",
                    "type": "other"
                },
                {
                    "item": "non-stick cooking spray",
                    "type": "other"
                },
                {
                    "item": "parchment paper",
                    "type": "other"
                }
            ],
            "ingredients": [],
            "nextPreview": [
                "Mash bananas"
            ],
            "summary": "Prepare your oven and loaf pan for baking."
        },
        {
            "title": "Mash bananas",
            "bullets": [
                "In a small mixing bowl, mash bananas with a fork.",
                "Set mashed bananas aside."
            ],
            "chips": [
                "bananas",
                "fork",
                "mixing bowl"
            ],
            "timerSeconds": 0,
            "needsNow": [
                {
                    "item": "very ripe bananas",
                    "type": "ingredient"
                },
                {
                    "item": "fork",
                    "type": "other"
                },
                {
                    "item": "mixing bowl",
                    "type": "other"
                }
            ],
            "ingredients": [
                {
                    "qty": "1 ½ cups (340 g)",
                    "name": "very ripe bananas",
                    "note": "about 4 medium"
                }
            ],
            "nextPreview": [
                "Combine dry ingredients"
            ],
            "summary": "Mash ripe bananas using a fork in a bowl."
        },
        {
            "title": "Combine dry ingredients",
            "bullets": [
                "In a mixing bowl, whisk together flour, baking soda, salt, and cinnamon."
            ],
            "chips": [
                "flour",
                "baking soda",
                "salt",
                "cinnamon",
                "whisk",
                "mixing bowl"
            ],
            "timerSeconds": 0,
            "needsNow": [
                {
                    "item": "all purpose flour",
                    "type": "other"
                },
                {
                    "item": "baking soda",
                    "type": "ingredient"
                },
                {
                    "item": "fine sea salt",
                    "type": "other"
                },
                {
                    "item": "ground cinnamon",
                    "type": "other"
                },
                {
                    "item": "whisk",
                    "type": "other"
                },
                {
                    "item": "mixing bowl",
                    "type": "other"
                }
            ],
            "ingredients": [
                {
                    "qty": "2 ½ cups (300 g)",
                    "name": "all purpose flour",
                    "note": "spooned and leveled"
                },
                {
                    "qty": "1 teaspoon",
                    "name": "baking soda",
                    "note": ""
                },
                {
                    "qty": "1 teaspoon",
                    "name": "fine sea salt",
                    "note": ""
                },
                {
                    "qty": "¼ teaspoon",
                    "name": "ground cinnamon",
                    "note": ""
                }
            ],
            "nextPreview": [
                "Combine wet ingredients"
            ],
            "summary": "Whisk together all dry ingredients in a bowl."
        },
        {
            "title": "Combine wet ingredients",
            "bullets": [
                "In the same bowl with mashed bananas, whisk in sugar, oil, eggs, vanilla extract, and sour cream until combined."
            ],
            "chips": [
                "mashed bananas",
                "sugar",
                "vegetable oil",
                "eggs",
                "vanilla extract",
                "sour cream",
                "whisk"
            ],
            "timerSeconds": 0,
            "needsNow": [
                {
                    "item": "granulated white sugar",
                    "type": "ingredient"
                },
                {
                    "item": "vegetable oil",
                    "type": "ingredient"
                },
                {
                    "item": "eggs",
                    "type": "ingredient"
                },
                {
                    "item": "vanilla extract",
                    "type": "other"
                },
                {
                    "item": "sour cream",
                    "type": "other"
                },
                {
                    "item": "whisk",
                    "type": "other"
                }
            ],
            "ingredients": [
                {
                    "qty": "1 ¼ cups (250 g)",
                    "name": "granulated white sugar",
                    "note": ""
                },
                {
                    "qty": "½ cup (120 mL)",
                    "name": "vegetable oil",
                    "note": ""
                },
                {
                    "qty": "2 large",
                    "name": "eggs",
                    "note": "room temperature"
                },
                {
                    "qty": "½ cup (113 g)",
                    "name": "sour cream",
                    "note": ""
                },
                {
                    "qty": "1 teaspoon",
                    "name": "vanilla extract",
                    "note": ""
                },
                {
                    "qty": "1 ½ cups (340 g)",
                    "name": "very ripe bananas",
                    "note": "about 4 medium"
                }
            ],
            "nextPreview": [
                "Combine wet and dry ingredients"
            ],
            "summary": "Mix mashed bananas with sugar, oil, eggs, vanilla, and sour cream."
        },
        {
            "title": "Combine wet and dry ingredients",
            "bullets": [
                "Add the dry ingredients into the wet ingredients.",
                "Mix together gently with a spatula until just combined."
            ],
            "chips": [
                "wet ingredients",
                "dry ingredients",
                "spatula",
                "mixing bowl"
            ],
            "timerSeconds": 0,
            "needsNow": [
                {
                    "item": "all purpose flour",
                    "type": "other"
                },
                {
                    "item": "baking soda",
                    "type": "ingredient"
                },
                {
                    "item": "fine sea salt",
                    "type": "other"
                },
                {
                    "item": "ground cinnamon",
                    "type": "other"
                },
                {
                    "item": "spatula",
                    "type": "other"
                }
            ],
            "ingredients": [
                {
                    "qty": "2 ½ cups (300 g)",
                    "name": "all purpose flour",
                    "note": "spooned and leveled"
                },
                {
                    "qty": "1 teaspoon",
                    "name": "baking soda",
                    "note": ""
                },
                {
                    "qty": "1 teaspoon",
                    "name": "fine sea salt",
                    "note": ""
                },
                {
                    "qty": "¼ teaspoon",
                    "name": "ground cinnamon",
                    "note": ""
                },
                {
                    "qty": "1 ¼ cups (250 g)",
                    "name": "granulated white sugar",
                    "note": ""
                },
                {
                    "qty": "½ cup (120 mL)",
                    "name": "vegetable oil",
                    "note": ""
                },
                {
                    "qty": "2 large",
                    "name": "eggs",
                    "note": "room temperature"
                },
                {
                    "qty": "½ cup (113 g)",
                    "name": "sour cream",
                    "note": ""
                },
                {
                    "qty": "1 teaspoon",
                    "name": "vanilla extract",
                    "note": ""
                },
                {
                    "qty": "1 ½ cups (340 g)",
                    "name": "very ripe bananas",
                    "note": "about 4 medium"
                }
            ],
            "nextPreview": [
                "Bake"
            ],
            "summary": "Gently fold dry ingredients into wet ingredients until just mixed."
        },
        {
            "title": "Bake",
            "bullets": [
                "Pour batter into the prepared loaf pan.",
                "Bake for 60-65 minutes at 350°F (177°C) until a toothpick inserted comes out clean.",
                "If using a glass pan, you may need to bake an additional 5 minutes.",
                "Remove bread from the oven and cool completely in the pan on a wire rack.",
                "Store bread covered at room temperature for 2 days or refrigerated for up to 1 week."
            ],
            "chips": [
                "batter",
                "loaf pan",
                "oven",
                "toothpick",
                "wire cooling rack"
            ],
            "timerSeconds": 3900,
            "needsNow": [
                {
                    "item": "loaf pan",
                    "type": "other"
                },
                {
                    "item": "oven",
                    "type": "other"
                },
                {
                    "item": "wire cooling rack",
                    "type": "other"
                },
                {
                    "item": "timer",
                    "type": "other"
                }
            ],
            "ingredients": [
                {
                    "qty": "1 ¼ cups (250 g)",
                    "name": "granulated white sugar",
                    "note": ""
                },
                {
                    "qty": "½ cup (120 mL)",
                    "name": "vegetable oil",
                    "note": ""
                },
                {
                    "qty": "2 large",
                    "name": "eggs",
                    "note": "room temperature"
                },
                {
                    "qty": "½ cup (113 g)",
                    "name": "sour cream",
                    "note": ""
                },
                {
                    "qty": "1 teaspoon",
                    "name": "vanilla extract",
                    "note": ""
                },
                {
                    "qty": "1 ½ cups (340 g)",
                    "name": "very ripe bananas",
                    "note": "about 4 medium"
                },
                {
                    "qty": "2 ½ cups (300 g)",
                    "name": "all purpose flour",
                    "note": "spooned and leveled"
                },
                {
                    "qty": "1 teaspoon",
                    "name": "baking soda",
                    "note": ""
                },
                {
                    "qty": "1 teaspoon",
                    "name": "fine sea salt",
                    "note": ""
                },
                {
                    "qty": "¼ teaspoon",
                    "name": "ground cinnamon",
                    "note": ""
                }
            ],
            "nextPreview": [],
            "summary": "Bake the banana bread until fully cooked then cool before storing."
        }
];

export const stepsBananaBread: StepData[] = stepsBananaBreadRaw.map((step) => ({
  ...step,
  bullets: textBullets(step.bullets),
}));

  export const ingredientsBananaBread = [
        {
            "qty": "1 ½ cups (340 g)",
            "name": "very ripe bananas",
            "note": "about 4 medium"
        },
        {
            "qty": "2 ½ cups (300 g)",
            "name": "all purpose flour",
            "note": "spooned and leveled"
        },
        {
            "qty": "1 teaspoon",
            "name": "baking soda",
            "note": ""
        },
        {
            "qty": "1 teaspoon",
            "name": "fine sea salt",
            "note": ""
        },
        {
            "qty": "¼ teaspoon",
            "name": "ground cinnamon",
            "note": ""
        },
        {
            "qty": "1 ¼ cups (250 g)",
            "name": "granulated white sugar",
            "note": ""
        },
        {
            "qty": "½ cup (120 mL)",
            "name": "vegetable oil",
            "note": ""
        },
        {
            "qty": "2 large",
            "name": "eggs",
            "note": "room temperature"
        },
        {
            "qty": "½ cup (113 g)",
            "name": "sour cream",
            "note": ""
        },
        {
            "qty": "1 teaspoon",
            "name": "vanilla extract",
            "note": ""
        }
    ];

// export const recipeTitleBananaBread = "Banana Bread";

const normalizedShrimpCurry = normalizeRecipePayload(recipeShrimpCurry);
const normalizedLadyfingers = normalizeRecipePayload(recipeLadyfingers);
const normalizedClaypotRice = normalizeRecipePayload(recipeClaypotRice);
const normalizedBananaBread = normalizeRecipePayload(bananaBreadRecipe);

export const libraryRecipes = [
//   {
//     title: recipeTitleBananaBread,
//     steps: stepsBananaBread,
//     ingredients: ingredientsBananaBread,
//   },
//   {
//     title: recipeTitleLemonChicken,
//     steps: stepsLemonChicken,
//     ingredients: ingredientsLemonChicken,
//   },
//   {
//     title: recipeTitleMisoNoodles,
//     steps: stepsMisoNoodles,
//     ingredients: ingredientsMisoNoodles,
//   },
//   {
//     title: recipeTitleSheetPanSalmon,
//     steps: stepsSheetPanSalmon,
//     ingredients: ingredientsSheetPanSalmon,
//   },
  {
    title: normalizedShrimpCurry.recipeTitle,
    steps: normalizedShrimpCurry.steps,
    ingredients: normalizedShrimpCurry.ingredients,
  },
  {
    title: normalizedLadyfingers.recipeTitle,
    steps: normalizedLadyfingers.steps,
    ingredients: normalizedLadyfingers.ingredients,
  },
  {
    title: normalizedClaypotRice.recipeTitle,
    steps: normalizedClaypotRice.steps,
    ingredients: normalizedClaypotRice.ingredients,
  },
  {
    title: normalizedBananaBread.recipeTitle,
    steps: normalizedBananaBread.steps,
    ingredients: normalizedBananaBread.ingredients,
  },
];

export const ingredientsClaypotRice = normalizedClaypotRice.ingredients;
export const stepsClaypotRice = normalizedClaypotRice.steps;
export const recipeTitleClaypotRice = normalizedClaypotRice.recipeTitle;


export const quickFixes = [
  "Split long steps",
  "Convert to bullets",
  "Normalize units",
  "Highlight times",
  "Highlight temperatures",
];
