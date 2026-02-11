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

export const stepsBananaBread: StepData[] = 
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
                    "label": "350°F (177°C)",
                    "type": "other"
                },
                {
                    "label": "loaf pan",
                    "type": "other"
                },
                {
                    "label": "non-stick cooking spray",
                    "type": "other"
                },
                {
                    "label": "parchment paper",
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
                    "label": "very ripe bananas",
                    "type": "ingredient"
                },
                {
                    "label": "fork",
                    "type": "other"
                },
                {
                    "label": "mixing bowl",
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
                    "label": "all purpose flour",
                    "type": "other"
                },
                {
                    "label": "baking soda",
                    "type": "ingredient"
                },
                {
                    "label": "fine sea salt",
                    "type": "other"
                },
                {
                    "label": "ground cinnamon",
                    "type": "other"
                },
                {
                    "label": "whisk",
                    "type": "other"
                },
                {
                    "label": "mixing bowl",
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
                    "label": "granulated white sugar",
                    "type": "ingredient"
                },
                {
                    "label": "vegetable oil",
                    "type": "ingredient"
                },
                {
                    "label": "eggs",
                    "type": "ingredient"
                },
                {
                    "label": "vanilla extract",
                    "type": "other"
                },
                {
                    "label": "sour cream",
                    "type": "other"
                },
                {
                    "label": "whisk",
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
                    "label": "all purpose flour",
                    "type": "other"
                },
                {
                    "label": "baking soda",
                    "type": "ingredient"
                },
                {
                    "label": "fine sea salt",
                    "type": "other"
                },
                {
                    "label": "ground cinnamon",
                    "type": "other"
                },
                {
                    "label": "spatula",
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
                    "label": "loaf pan",
                    "type": "other"
                },
                {
                    "label": "oven",
                    "type": "other"
                },
                {
                    "label": "wire cooling rack",
                    "type": "other"
                },
                {
                    "label": "timer",
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

export const recipeTitleBananaBread = "Banana Bread";

export const libraryRecipes = [
  {
    title: recipeTitleBananaBread,
    steps: stepsBananaBread,
    ingredients: ingredientsBananaBread,
  },
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
