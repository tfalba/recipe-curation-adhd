import { useEffect, useMemo, useRef, useState } from "react";
import type { BulletPart, StepData, TimerItem } from "./types";
import { formatTime } from "./utils";
import { useRecipe } from "../recipe/RecipeContext";
import { useSettings } from "../settings/SettingsContext";
import alarmSound from "../assets/microwave-bell-ding.mp3";

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
  highlightTimes: boolean;
  highlightTemperatures: boolean;
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
  highlightTimes,
  highlightTemperatures,
}: CookPanelProps) {
  const [touchedIngredient, setTouchedIngredient] = useState<string | null>(null);
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  const [alarmActive, setAlarmActive] = useState(false);
  const ingredientsRef = useRef<HTMLUListElement | null>(null);
  const completedTimersRef = useRef<Set<string>>(new Set());
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  const alarmTimeoutRef = useRef<number | null>(null);
  const { recipeTitle } = useRecipe();
  const { soundOn } = useSettings();

  const stopAlarm = () => {
    if (alarmTimeoutRef.current) {
      window.clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
    }
    setAlarmActive(false);
  };

  const playTimerChime = async () => {
    try {
      if (!alarmAudioRef.current) {
        const audio = new Audio(alarmSound);
        audio.volume = 0.9;
        audio.loop = true;
        alarmAudioRef.current = audio;
      }
      const audio = alarmAudioRef.current;
      audio.currentTime = 0;
      await audio.play();
      setAlarmActive(true);
      if (alarmTimeoutRef.current) {
        window.clearTimeout(alarmTimeoutRef.current);
      }
      alarmTimeoutRef.current = window.setTimeout(() => {
        stopAlarm();
      }, 10000);
    } catch {
      // Ignore audio failures (autoplay or unsupported browser).
    }
  };

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

  useEffect(() => {
    const completedIds = completedTimersRef.current;
    timers.forEach((timer) => {
      if (timer.remainingSeconds > 0) {
        completedIds.delete(timer.id);
        return;
      }
      if (!completedIds.has(timer.id)) {
        completedIds.add(timer.id);
        if (soundOn) {
          void playTimerChime();
        }
      }
    });
  }, [soundOn, timers]);

  useEffect(
    () => () => {
      stopAlarm();
    },
    []
  );

  const timePattern = useMemo(
    () =>
      /\b\d+(?:\.\d+)?(?:\s*(?:-|to)\s*\d+(?:\.\d+)?)?\s*(?:hours?|hrs?|hr|minutes?|mins?|min|seconds?|secs?|sec)\b/gi,
    []
  );

  const temperaturePattern = useMemo(
    () =>
      /\b\d{2,3}\s*(?:°\s?[CF]|degrees?\s*(?:Celsius|Fahrenheit|C|F))\b/gi,
    []
  );

  const highlightTextByPattern = (
    text: string,
    pattern: RegExp,
    kind: "time" | "temperature"
  ) => {
    const matches = Array.from(text.matchAll(pattern));
    if (!matches.length) {
      return [{ value: text, kind: "text" as const }];
    }

    const parts: { value: string; kind: "text" | "time" | "temperature" }[] = [];
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
          ? highlightTextByPattern(part.value, temperaturePattern, "temperature")
          : [part]
      );
    }

    if (highlightTimes) {
      parts = parts.flatMap((part) =>
        part.kind === "text"
          ? highlightTextByPattern(part.value, timePattern, "time")
          : [part]
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

  const renderBulletParts = (
    parts: BulletPart[]
  ) =>
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

  const bulletToText = (
    parts: BulletPart[]
  ) =>
    parts
      .map((part) => {
        if (part.type === "ingredient" && part.ingredient?.name) {
          return part.ingredient.name;
        }
        if (part.type === "text") {
          return part.value ?? "";
        }
        return "";
      })
      .join("");

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Cook Mode
          </p>
          <h3 className="text-2xl font-display font-semibold">
            {recipeTitle}
          </h3>
        </div>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-bg">
          {focusMode ? "Focus mode on" : "Standard mode"}
        </span>
      </div>
      <div
        className={`mt-6 grid gap-4 ${
          focusMode ? "lg:grid-cols-1" : "md:grid-cols-[minmax(0,1fr)_280px]"
        }`}
      >
        <div className="rounded-3xl border border-border bg-bg p-2 md:p-6">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted">
              {progressLabel}
            </span>
            <span className="rounded-full bg-primary/40 px-3 py-1 text-xs text-muted">
              {currentTimerLabel}
            </span>
          </div>
          <h4 className="mt-4 text-2xl font-display font-semibold">
            {activeStep.title}
          </h4>
          <ul className="recipe-prose mt-4 list-disc space-y-3 pl-5 text-base text-text">
            {activeStep.bullets.map((bullet, index) => (
              <li key={`${activeStep.title}-bullet-${index}`}>
                {renderBulletParts(bullet.parts)}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onPrev}
              className="min-h-[52px] flex-1 rounded-2xl border border-border bg-surface-2 px-4 text-sm font-semibold text-muted shadow-focus"
            >
              Back
            </button>
            <button
              onClick={onStartTimer}
              disabled={!activeStep.timerSeconds || activeStep.timerSeconds <= 0}
              className="min-h-[52px] flex-1 rounded-2xl border border-violet/50 bg-violet/70 px-4 text-sm font-semibold text-muted shadow-panel disabled:cursor-not-allowed disabled:opacity-60"
            >
              Start timer
            </button>
            <button
              onClick={onNext}
              className="min-h-[52px] flex-1 rounded-2xl bg-accent px-4 text-sm font-semibold text-bg shadow-panel"
            >
              Next
            </button>
          </div>
          <button
            onClick={onRescue}
            className="mt-6 w-full min-h-[44px] rounded-2xl border border-border bg-surface-2 px-4 text-sm font-semibold text-muted shadow-glow"
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
                Next action:{" "}
                {activeStep.bullets[0]
                  ? bulletToText(activeStep.bullets[0].parts)
                  : ""}
              </p>
            </div>
          ) : null}
        </div>

        {focusMode ? null : (
          <div className="space-y-3">
            {activeStep.ingredients.length ? (
              <div className="rounded-2xl border border-border bg-surface-2 p-2 md:p-4">
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
                      className={`group relative rounded-full bg-surface border border-violet/80 px-3 py-1 text-xs text-text focus-within:ring-2 focus-within:ring-text/60 transition duration-quick ease-snappy ${
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
                        onTouchEnd={() => setTouchedIngredient(null)}
                        className="text-left text-text focus:outline-none"
                      >
                        {ingredient.name}
                      </button>
                      <span
                        className={`pointer-events-none absolute top-full mt-2 left-1/4 -translate-x-1/2 whitespace-nowrap rounded-xl border border-violet/10 bg-violet/80 px-3 py-1 text-[11px] text-text opacity-0 shadow-panel transition duration-quick ease-snappy group-hover:opacity-100 group-focus-within:opacity-100 z-20 ${
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
            <div className="rounded-2xl border border-border bg-surface-2 p-2 md:p-4">
              <h5 className="text-sm font-semibold">Next step preview</h5>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-muted">
                {activeStep.nextPreview.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-surface-2 p-2 md:p-4">
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
              {alarmActive ? (
                <button
                  onClick={stopAlarm}
                  className="mt-3 w-full min-h-[44px] rounded-2xl border border-danger/50 bg-danger/20 px-4 text-sm font-semibold text-danger"
                >
                  Stop alarm
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
