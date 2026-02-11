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
              <li key={bullet}>{bullet}</li>
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
            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <h5 className="text-sm font-semibold">This step needs</h5>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
                {activeStep.needsNow.map((item) => (
                  <li
                    key={item.label}
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.type === "ingredient"
                        ? "bg-violet/90 text-white/90"
                        : "bg-bg border border-white/70 text-muted"
                    }`}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <h5 className="text-sm font-semibold">Ingredients for this step</h5>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
                {activeStep.ingredients.map((ingredient) => (
                  <li
                    key={`${ingredient.name}-${ingredient.qty}`}
                    className="rounded-full bg-bg px-3 py-1 text-xs text-muted"
                  >
                    <span className="text-text">{ingredient.qty}</span>{" "}
                    {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
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
