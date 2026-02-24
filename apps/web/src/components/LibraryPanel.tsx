import { useEffect, useState } from "react";
import { libraryRecipes } from "../data/data";
import { useRecipe } from "../recipe/RecipeContext";

type LibraryPanelProps = {
  onSelectRecipeReview?: () => void;
  onSelectRecipeCook?: () => void;
  onCreateNewGuide?: () => void;
};

const LIBRARY_ANIMATION_LAST_RUN_KEY = "library-card-animation-last-run";
const LIBRARY_ANIMATION_COOLDOWN_MS = 5 * 60 * 1000;
const LIBRARY_CARD_STAGGER_MS = 120;
const LIBRARY_CARD_ANIMATION_MS = 520;

export default function LibraryPanel({
  onSelectRecipeReview,
  onSelectRecipeCook,
  onCreateNewGuide,
}: LibraryPanelProps) {
  const { applyRecipe, savedRecipes } = useRecipe();
  const [animateCards, setAnimateCards] = useState(false);
  const savedTitles = new Set(savedRecipes.map((recipe) => recipe.title));
  const allRecipes = [
    ...savedRecipes.map((recipe) => ({
      ...recipe,
      badge: "Saved" as const,
    })),
    ...libraryRecipes
      .filter((recipe) => !savedTitles.has(recipe.title))
      .map((recipe) => ({
        ...recipe,
        badge: "Sample" as const,
      })),
  ];

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const root = document.documentElement;
    const shouldReduceMotion =
      root.classList.contains("reduce-motion") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (shouldReduceMotion) {
      setAnimateCards(false);
      return;
    }

    const now = Date.now();
    const lastRunRaw = window.localStorage.getItem(LIBRARY_ANIMATION_LAST_RUN_KEY);
    const lastRun = Number(lastRunRaw);
    const hasCooldownElapsed =
      !Number.isFinite(lastRun) || now - lastRun >= LIBRARY_ANIMATION_COOLDOWN_MS;

    if (!hasCooldownElapsed) {
      setAnimateCards(false);
      return;
    }

    setAnimateCards(true);
    const maxDelayMs = Math.max(0, allRecipes.length - 1) * LIBRARY_CARD_STAGGER_MS;
    const markCompleteTimeout = window.setTimeout(() => {
      window.localStorage.setItem(
        LIBRARY_ANIMATION_LAST_RUN_KEY,
        String(Date.now()),
      );
    }, maxDelayMs + LIBRARY_CARD_ANIMATION_MS);

    return () => window.clearTimeout(markCompleteTimeout);
  }, [allRecipes.length]);

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Saved Guides
          </p>
          <h3 className="text-xl font-display font-semibold">
            Library for fast re-cooks
          </h3>
        </div>
        <button
          onClick={onCreateNewGuide}
          className="min-h-[44px] rounded-2xl bg-primary px-4 text-sm font-semibold text-bg"
        >
          New Recipe
        </button>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {allRecipes.map((recipe, index) => (
          <div
            key={recipe.title}
            className={`${animateCards ? "library-card-reveal " : ""}rounded-2xl border border-border bg-surface-2 p-2 md:p-4 shadow-focus`}
            style={
              animateCards
                ? { animationDelay: `${index * LIBRARY_CARD_STAGGER_MS}ms` }
                : undefined
            }
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{recipe.title}</p>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                  recipe.badge === "Saved"
                    ? "bg-info/20 text-info"
                    : "bg-warning/20 text-warning"
                }`}
              >
                {recipe.badge}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted">Last cooked 2 days ago</p>
            <div className="mt-3 flex gap-4">
              <button 
                 onClick={() => {
                  applyRecipe(recipe);
                  onSelectRecipeReview?.();
                }}
              className="min-h-[36px] flex-1 rounded-full border border-violet/50 bg-violet/70 text-xs font-semibold text-text shadow-panel transition duration-quick ease-snappy hover:translate-y-[-2px] hover:shadow-glow">
                Review
              </button>
            
              <button
                onClick={() => {
                  applyRecipe(recipe);
                  onSelectRecipeCook?.();
                }}
                className="min-h-[36px] flex-1 rounded-full bg-accent/90 border border-accent/40 text-xs font-semibold text-bg shadow-panel transition duration-quick ease-snappy hover:translate-y-[-2px] hover:shadow-glow"
              >
                Cook
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
