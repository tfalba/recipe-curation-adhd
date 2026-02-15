import { useState } from "react";
import { useRecipe } from "../recipe/RecipeContext";

type TopBarProps = {
  viewTitle: string;
  progressLabel: string;
  focusMode: boolean;
  onToggleFocus: () => void;
  isCook: boolean;
};

export default function TopBar({
  viewTitle,
  progressLabel,
  focusMode,
  onToggleFocus,
  isCook,
}: TopBarProps) {

  const [saveNotice, setSaveNotice] = useState(false);
  const {recipeTitle, savedRecipes, recipeSource, status, saveCurrentRecipe} = useRecipe();


  const isRecipeSaved = savedRecipes.some(
    (recipe) => recipe.title === recipeTitle
  );
  const showSaveGuide =
    recipeSource === "generated" && status === "success" && !isRecipeSaved;

  const handleSaveGuide = () => {
    const didSave = saveCurrentRecipe();
    if (didSave) {
      setSaveNotice(true);
      window.setTimeout(() => setSaveNotice(false), 3000);
    }
  };


  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-surface/90 px-5 py-4 shadow-panel backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/40 text-muted">
          RG
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Recipe Genius
          </p>
          <p className="text-lg font-display font-semibold">
            One step per screen. Big, calm, focused.
            <span className="sr-only">{viewTitle}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isCook ? (
          <span className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {progressLabel}
          </span>
        ) : (
          null
        )}
        <button
          onClick={onToggleFocus}
          className={`min-h-[44px] rounded-2xl border border-border px-4 text-sm font-semibold transition duration-quick ease-snappy ${
            focusMode
              ? "bg-accent/20 text-accent"
              : "bg-surface-2 text-muted hover:text-text"
          }`}
        >
          Focus
        </button>
        {showSaveGuide ? (
          <button
            onClick={handleSaveGuide}
            className="min-h-[44px] rounded-2xl bg-primary px-5 text-sm font-semibold text-bg shadow-focus transition duration-quick ease-snappy hover:translate-y-[-1px]"
          >
            Save Guide
          </button>
        ) : null}
      </div>
      {saveNotice ? (
            <div className="mt-4 rounded-2xl border border-success/40 bg-success/15 px-4 py-3 text-sm text-text shadow-panel">
              Recipe saved to your library.
            </div>
          ) : null}
    </header>
  );
}
