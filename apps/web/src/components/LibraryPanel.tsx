import { libraryRecipes } from "../data";
import { useRecipe } from "../recipe/RecipeContext";

export default function LibraryPanel() {
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
        <button className="min-h-[44px] rounded-2xl bg-primary px-4 text-sm font-semibold text-white">
          New paste
        </button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {libraryRecipes.map((recipe) => (
          <div
            key={recipe.title}
            className="rounded-2xl border border-border bg-surface-2 p-4"
          >
            <p className="text-sm font-semibold">{recipe.title}</p>
            <p className="mt-2 text-xs text-muted">Last cooked 2 days ago</p>
            <div className="mt-3 flex gap-2">
              <button className="min-h-[36px] flex-1 rounded-full border border-border bg-bg text-xs text-muted">
                Edit
              </button>
              <button
                onClick={() => applyRecipe(recipe)}
                className="min-h-[36px] flex-1 rounded-full bg-accent text-xs font-semibold text-black"
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
