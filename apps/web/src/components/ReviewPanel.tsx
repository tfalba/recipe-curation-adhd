import { useMemo } from "react";
import type { BulletPart, Ingredient, RecipeSummary, StepData } from "./types";

type ReviewPanelProps = {
  steps: StepData[];
  ingredients: Ingredient[];
  recipeSummary: RecipeSummary;
  quickFixes: string[];
  onGenerateCookMode?: () => void;
  highlightTimes: boolean;
  highlightTemperatures: boolean;
  onToggleHighlightTimes: () => void;
  onToggleHighlightTemperatures: () => void;
  splitLongStepsApplied: boolean;
  onSplitLongStepsQuickFix: () => void;
  doubleRecipeEnabled: boolean;
  onToggleDoubleRecipe: () => void;
};

export default function ReviewPanel({
  steps,
  ingredients,
  recipeSummary,
  quickFixes,
  onGenerateCookMode,
  highlightTimes,
  highlightTemperatures,
  onToggleHighlightTimes,
  onToggleHighlightTemperatures,
  splitLongStepsApplied,
  onSplitLongStepsQuickFix,
  doubleRecipeEnabled,
  onToggleDoubleRecipe,
}: ReviewPanelProps) {
  const timePattern = useMemo(
    () =>
      /\b\d+(?:\.\d+)?(?:\s*(?:-|to)\s*\d+(?:\.\d+)?)?\s*(?:hours?|hrs?|hr|minutes?|mins?|min|seconds?|secs?|sec)\b/gi,
    [],
  );

  const temperaturePattern = useMemo(
    () => /\b\d{2,3}\s*(?:°\s?[CF]|degrees?\s*(?:Celsius|Fahrenheit|C|F))\b/gi,
    [],
  );

  const highlightTextByPattern = (
    text: string,
    pattern: RegExp,
    kind: "time" | "temperature",
  ) => {
    const matches = Array.from(text.matchAll(pattern));
    if (!matches.length) {
      return [{ value: text, kind: "text" as const }];
    }

    const parts: { value: string; kind: "text" | "time" | "temperature" }[] =
      [];
    let cursor = 0;
    matches.forEach((match) => {
      const matchText = match[0];
      const start = match.index ?? 0;
      if (start > cursor) {
        parts.push({ value: text.slice(cursor, start), kind: "text" });
      }
      parts.push({ value: matchText, kind });
      cursor = start + matchText.length;
    });
    if (cursor < text.length) {
      parts.push({ value: text.slice(cursor), kind: "text" });
    }
    return parts;
  };

  const renderHighlightedText = (value: string, keyPrefix: string) => {
    let parts: { value: string; kind: "text" | "time" | "temperature" }[] = [
      { value, kind: "text" },
    ];

    if (highlightTemperatures) {
      parts = parts.flatMap((part) =>
        part.kind === "text"
          ? highlightTextByPattern(
              part.value,
              temperaturePattern,
              "temperature",
            )
          : [part],
      );
    }

    if (highlightTimes) {
      parts = parts.flatMap((part) =>
        part.kind === "text"
          ? highlightTextByPattern(part.value, timePattern, "time")
          : [part],
      );
    }

    return parts.map((part, index) => {
      if (part.kind === "temperature") {
        return (
          <span
            key={`${keyPrefix}-temp-${index}`}
            className="rounded bg-danger/20 px-1 py-0.5 font-semibold text-danger"
          >
            {part.value}
          </span>
        );
      }

      if (part.kind === "time") {
        return (
          <span
            key={`${keyPrefix}-time-${index}`}
            className="rounded bg-warning/20 px-1 py-0.5 font-semibold text-warning"
          >
            {part.value}
          </span>
        );
      }

      return <span key={`${keyPrefix}-text-${index}`}>{part.value}</span>;
    });
  };

  const renderBulletParts = (parts: BulletPart[]) =>
    parts.map((part, index) => {
      if (part.type === "ingredient" && part.ingredient?.name) {
        return (
          <span
            key={`ingredient-${part.ingredient.name}-${index}`}
            className="text-accent underline decoration-accent"
          >
            {part.ingredient.name}
          </span>
        );
      }
      if (part.type === "text") {
        return (
          <span key={`text-${index}`}>
            {renderHighlightedText(part.value ?? "", `part-${index}`)}
          </span>
        );
      }

      return null;
    });

  const getQuickFixButtonState = (fix: string) => {
    const normalized = fix.toLowerCase();
    const isDoubleRecipeFix = normalized === "double recipe";
    const isSplitFix = normalized === "split long steps";
    const isTimesFix = normalized === "highlight times";
    const isTemperaturesFix =
      normalized === "highlight temperatures" ||
      normalized === "highlight temps";

    if (isDoubleRecipeFix) {
      return {
        active: doubleRecipeEnabled,
        onClick: onToggleDoubleRecipe,
      };
    }

    if (isSplitFix) {
      return {
        active: splitLongStepsApplied,
        onClick: onSplitLongStepsQuickFix,
      };
    }

    if (isTimesFix) {
      return {
        active: highlightTimes,
        onClick: onToggleHighlightTimes,
      };
    }

    if (isTemperaturesFix) {
      return {
        active: highlightTemperatures,
        onClick: onToggleHighlightTemperatures,
      };
    }

    return { active: false, onClick: undefined };
  };

  const getQuickFixLabel = (fix: string) => {
    if (fix.toLowerCase() === "split long steps" && splitLongStepsApplied) {
      return "Reduce to fewer steps";
    }
    return fix;
  };

  const recipeSummaryChips = [
    recipeSummary.servings,
    `Prep: ${recipeSummary.prepTime}`,
    `Cook: ${recipeSummary.cookTime}`,
  ].filter((chip) => chip.trim().length > 0);

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Review + Edit
          </p>
          <h3 className="text-xl font-display font-semibold">
            Quick fixes before Cook Mode
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickFixes.map((fix) => {
            const { active, onClick } = getQuickFixButtonState(fix);
            return (
              <button
                key={fix}
                type="button"
                onClick={onClick}
                className={`min-h-[36px] rounded-full border px-3 text-xs font-semibold ${
                  active
                    ? "border-accent bg-accent/20 text-accent"
                    : "border-border bg-surface-2 text-muted"
                }`}
              >
                {getQuickFixLabel(fix)}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border bg-surface-2 p-2 md:p-4"
            >
              <div className="flex items-center gap-1">
                <p className="text-base font-semibold text-accent">
                  Step {index + 1}:
                </p>

                <p className="text-base font-display">{step.title}</p>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-muted">
                {step.bullets.map((bullet, index) => (
                  <li key={`${step.title}-bullet-${index}`}>
                    {renderBulletParts(bullet.parts)}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {step.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-bg px-3 py-1 text-xs text-muted shadow-focus"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-surface-2 p-2 md:p-4">
            <h4 className="text-sm font-semibold">Ingredients</h4>
            <p className="text-xs text-muted">
              Grouped by step (tap to change)
            </p>
            <div className="mt-3 space-y-3">
              {ingredients.map((item) => (
                <label
                  key={item.name}
                  className="flex items-start gap-3 text-sm"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-border bg-bg text-accent"
                  />
                  <span>
                    <span className="font-semibold text-text">{item.qty}</span>{" "}
                    {item.name}
                    <span className="text-muted"> · {item.note}</span>
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={onGenerateCookMode}
              className="mt-4 min-h-[36px] w-full rounded-2xl bg-primary px-4 text-sm font-semibold text-white/80"
            >
              Go To Cook Mode
            </button>
          </div>
          <div className="rounded-2xl border border-border bg-surface-2 p-2 md:p-4">
            <h4 className="text-sm font-semibold">Recipe summary</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {recipeSummaryChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-bg px-3 py-1 text-xs text-muted"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
