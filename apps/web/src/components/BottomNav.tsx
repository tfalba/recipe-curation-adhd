import type { ViewKey } from "./types";
import { useView } from "../view/ViewContext";
import { useRecipe } from "../recipe/RecipeContext";

export default function BottomNav() {
  const { activeView, setActiveView } = useView();
  const { hasSelectedRecipe, setSampleRecipeSelection } = useRecipe();
  const items: { key: ViewKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "review", label: "Review" },
    { key: "cook", label: "Cook" },
    { key: "library", label: "Library" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-border bg-surface/90 px-4 py-3 text-xs text-muted backdrop-blur">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => {
            if (
              (item.key === "review" || item.key === "cook") &&
              !hasSelectedRecipe
            ) {
              setSampleRecipeSelection();
            }
            setActiveView(item.key);
          }}
          className={`min-h-[44px] px-2 ${
            activeView === item.key ? "text-accent" : "text-muted"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
