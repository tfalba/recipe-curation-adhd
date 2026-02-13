import { libraryRecipes } from "../data/data";
import { useRecipe } from "../recipe/RecipeContext";

type LibraryPanelProps = {
  onSelectRecipeReview?: () => void;
  onSelectRecipeCook?: () => void;
  onCreateNewRecipe?: () => void;
};

export default function LibraryPanel({
  onSelectRecipeReview,
  onSelectRecipeCook,
  onCreateNewRecipe,
}: LibraryPanelProps) {
  const { applyRecipe } = useRecipe();
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
          onClick={onCreateNewRecipe}
          className="min-h-[44px] rounded-2xl bg-primary px-4 text-sm font-semibold text-bg"
        >
          New Recipe
        </button>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {libraryRecipes.map((recipe) => (
          <div
            key={recipe.title}
            className="rounded-2xl border border-border bg-surface-2 p-2 md:p-4 shadow-focus"
          >
            <p className="text-sm font-semibold">{recipe.title}</p>
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
