import type { Ingredient, StepData } from "./types";

type ReviewPanelProps = {
  steps: StepData[];
  ingredients: Ingredient[];
  quickFixes: string[];
  onGenerateCookMode?: () => void;
};

export default function ReviewPanel({
  steps,
  ingredients,
  quickFixes,
  onGenerateCookMode,
}: ReviewPanelProps) {
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
          {quickFixes.map((fix) => (
            <button
              key={fix}
              className="min-h-[36px] rounded-full border border-border bg-surface-2 px-3 text-xs font-semibold text-muted"
            >
              {fix}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border bg-surface-2 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Step {index + 1}</p>
                <button className="text-xs font-semibold text-accent">
                  Simplify
                </button>
              </div>
              <p className="mt-2 text-base font-display">{step.title}</p>
              <ul className="mt-2 list-disc space-y-2 pl-4 text-sm text-muted">
                {step.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                {step.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-bg px-3 py-1 text-xs text-muted"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-surface-2 p-4">
            <h4 className="text-sm font-semibold">Ingredients</h4>
            <p className="text-xs text-muted">Grouped by step (tap to change)</p>
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
              className="mt-4 min-h-[36px] w-full rounded-2xl bg-primary px-4 text-sm font-semibold text-text"
            >
              Go To Cook Mode
            </button>
          </div>
          <div className="rounded-2xl border border-border bg-surface-2 p-4">
            <h4 className="text-sm font-semibold">Recipe summary</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {["4 servings", "25 min", "Skillet", "High protein"].map((chip) => (
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
