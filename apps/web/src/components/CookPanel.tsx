import { useEffect, useRef, useState } from "react";
import type { StepData, TimerItem } from "./types";
import { formatTime } from "./utils";

type CookPanelProps = {
  focusMode: boolean;
  progressLabel: string;
  currentTimerLabel: string;
  activeStep: StepData;
  onPrev: () => void;
  onNext: () => void;
  onStartTimer: () => void;
  onRescue: () => void;
  timers: TimerItem[];
  showRescue: boolean;
};

export default function CookPanel({
  focusMode,
  progressLabel,
  currentTimerLabel,
  activeStep,
  onPrev,
  onNext,
  onStartTimer,
  onRescue,
  timers,
  showRescue,
}: CookPanelProps) {
  const [touchedIngredient, setTouchedIngredient] = useState<string | null>(null);
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  const ingredientsRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!touchedIngredient) {
      return;
    }
    const timeout = window.setTimeout(() => setTouchedIngredient(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [touchedIngredient]);

  const activeIngredientId = hoveredIngredient ?? touchedIngredient;

  useEffect(() => {
    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (!ingredientsRef.current) {
        return;
      }
      if (event.target instanceof Node && ingredientsRef.current.contains(event.target)) {
        return;
      }
      setHoveredIngredient(null);
      setTouchedIngredient(null);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  const renderBullet = (text: string) => {
    const names = activeStep.ingredients
      .map((ingredient) => ingredient.name)
      .filter((name) => name.trim().length > 0);

    if (names.length === 0) {
      return text;
    }

    const escaped = names
      .sort((a, b) => b.length - a.length)
      .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
    const parts = text.split(pattern);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={`${part}-${index}`} className="text-accent underline decoration-accent">
            {part}
          </span>
        );
      }
      return <span key={`${part}-${index}`}>{part}</span>;
    });
  };

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Cook Mode
          </p>
          <h3 className="text-2xl font-display font-semibold">
            One step per screen. Big, calm, focused.
          </h3>
        </div>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-black">
          {focusMode ? "Focus mode on" : "Standard mode"}
        </span>
      </div>
      <div
        className={`mt-6 grid gap-4 ${
          focusMode ? "lg:grid-cols-1" : "md:grid-cols-[minmax(0,1fr)_280px]"
        }`}
      >
        <div className="rounded-3xl border border-border bg-bg p-6">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted">
              {progressLabel}
            </span>
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
              {currentTimerLabel}
            </span>
          </div>
          <h4 className="mt-4 text-2xl font-display font-semibold">
            {activeStep.title}
          </h4>
          <ul className="recipe-prose mt-4 list-disc space-y-3 pl-5 text-base text-text">
            {activeStep.bullets.map((bullet) => (
              <li key={bullet}>{renderBullet(bullet)}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onPrev}
              className="min-h-[52px] flex-1 rounded-2xl border border-border bg-surface-2 px-4 text-sm font-semibold text-muted"
            >
              Back
            </button>
            <button
              onClick={onStartTimer}
              className="min-h-[52px] flex-1 rounded-2xl border border-border bg-surface-2 px-4 text-sm font-semibold text-muted"
            >
              Start timer
            </button>
            <button
              onClick={onNext}
              className="min-h-[52px] flex-1 rounded-2xl bg-accent px-4 text-sm font-semibold text-black shadow-glow"
            >
              Next
            </button>
          </div>
          <button
            onClick={onRescue}
            className="mt-4 w-full min-h-[44px] rounded-2xl border border-border bg-surface-2 px-4 text-sm font-semibold text-muted"
          >
            I got distracted
          </button>
          {showRescue ? (
            <div className="mt-4 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-muted">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Rescue
              </p>
              <p className="mt-2 text-sm text-text">{activeStep.summary}</p>
              <p className="mt-1 text-xs text-muted">
                Next action: {activeStep.bullets[0]}
              </p>
            </div>
          ) : null}
        </div>

        {focusMode ? null : (
          <div className="space-y-3">
            {activeStep.ingredients.length ? (
              <div className="rounded-2xl border border-border bg-surface-2 p-4">
                <h5 className="text-sm font-semibold">
                  Ingredients for this step
                </h5>
                <ul
                  ref={ingredientsRef}
                  className="my-3 flex flex-wrap gap-2 text-sm text-muted"
                >
                  {activeStep.ingredients.map((ingredient) => (
                    <li
                      key={`${ingredient.name}-${ingredient.qty}`}
                      className={`group relative rounded-full bg-surface border border-violet/80 px-3 py-1 text-xs text-text focus-within:ring-2 focus-within:ring-white/60 transition duration-quick ease-snappy ${
                        activeIngredientId &&
                        activeIngredientId !==
                          `${ingredient.name}-${ingredient.qty}`
                          ? "opacity-25"
                          : "opacity-100"
                      }`}
                    >
                      <button
                        type="button"
                        onMouseEnter={() =>
                          setHoveredIngredient(
                            `${ingredient.name}-${ingredient.qty}`
                          )
                        }
                        onMouseLeave={() => setHoveredIngredient(null)}
                        onFocus={() =>
                          setHoveredIngredient(
                            `${ingredient.name}-${ingredient.qty}`
                          )
                        }
                        onBlur={() => setHoveredIngredient(null)}
                        onTouchStart={() =>
                          setTouchedIngredient(
                            `${ingredient.name}-${ingredient.qty}`
                          )
                        }
                        className="text-left text-text focus:outline-none"
                      >
                        {ingredient.name}
                      </button>
                      <span
                        className={`pointer-events-none absolute top-full mt-2 left-1/4 -translate-x-1/2 whitespace-nowrap rounded-xl border border-border bg-violet/80 px-3 py-1 text-[11px] text-text opacity-0 shadow-panel transition duration-quick ease-snappy group-hover:opacity-100 group-focus-within:opacity-100 z-20 ${
                          touchedIngredient ===
                          `${ingredient.name}-${ingredient.qty}`
                            ? "opacity-100"
                            : ""
                        }`}
                      >
                        {ingredient.qty}
                      </span>
                    </li>
                  ))}
                </ul>
                <span className="mx-auto hidden lg:block text-xs text-muted">Hover over an ingredient to view its quantity.</span>
                <span className="mx-auto lg:hidden text-xs text-muted">Click on an ingredient to view its quantity.</span>

              </div>
            ) : null}
            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <h5 className="text-sm font-semibold">Next step preview</h5>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-muted">
                {activeStep.nextPreview.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <h5 className="text-sm font-semibold">Active timers</h5>
              <div className="mt-3 space-y-2">
                {timers.map((timer) => (
                  <div
                    key={timer.id}
                    className="flex items-center justify-between rounded-2xl border border-border bg-bg px-3 py-2 text-sm"
                  >
                    <span>{timer.label}</span>
                    <span className="text-accent">
                      {formatTime(timer.remainingSeconds)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
