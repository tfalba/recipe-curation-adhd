import { useEffect, useMemo, useState } from "react";
import {
  AppShell,
  BottomNav,
  MobileView,
  TopBar,
} from "./components";
import type { Ingredient, StepData, TimerItem, ViewKey } from "./components";
import { quickFixes } from "./data/data";
import { useRecipe } from "./recipe/RecipeContext";
import { HeroAboveTheFold } from "./components/HeroAboveTheFold";
import { FooterBelowTheFold } from "./components/FooterBelowTheFold";
import { useView } from "./view/ViewContext";
import { useSettings } from "./settings/SettingsContext";

const nextStepIndex = (index: number, total: number) =>
  total === 0 ? 0 : (index + 1) % total;
const prevStepIndex = (index: number, total: number) =>
  total === 0 ? 0 : (index - 1 + total) % total;

const FRACTION_MAP: Record<string, string> = {
  "¼": "1/4",
  "½": "1/2",
  "¾": "3/4",
  "⅐": "1/7",
  "⅑": "1/9",
  "⅒": "1/10",
  "⅓": "1/3",
  "⅔": "2/3",
  "⅕": "1/5",
  "⅖": "2/5",
  "⅗": "3/5",
  "⅘": "4/5",
  "⅙": "1/6",
  "⅚": "5/6",
  "⅛": "1/8",
  "⅜": "3/8",
  "⅝": "5/8",
  "⅞": "7/8",
};

const normalizeUnicodeFractions = (value: string) =>
  value
    .split("")
    .map((char, index, source) => {
      const mapped = FRACTION_MAP[char];
      if (!mapped) {
        return char;
      }
      const prev = source[index - 1] ?? "";
      return /\d/.test(prev) ? ` ${mapped}` : mapped;
    })
    .join("");

const parseNumberToken = (token: string) => {
  const mixed = token.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const whole = Number.parseInt(mixed[1], 10);
    const top = Number.parseInt(mixed[2], 10);
    const bottom = Number.parseInt(mixed[3], 10);
    if (bottom === 0) {
      return null;
    }
    return whole + top / bottom;
  }

  const fraction = token.match(/^(\d+)\/(\d+)$/);
  if (fraction) {
    const top = Number.parseInt(fraction[1], 10);
    const bottom = Number.parseInt(fraction[2], 10);
    if (bottom === 0) {
      return null;
    }
    return top / bottom;
  }

  const decimal = Number.parseFloat(token);
  return Number.isFinite(decimal) ? decimal : null;
};

const formatNumber = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) {
    return `${rounded}`;
  }
  return `${rounded}`
    .replace(/\.0+$/, "")
    .replace(/(\.\d*[1-9])0+$/, "$1");
};

const doubleQuantityText = (value: string) => {
  const normalized = normalizeUnicodeFractions(value);
  return normalized.replace(
    /\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?/g,
    (match) => {
      const parsed = parseNumberToken(match);
      if (parsed === null) {
        return match;
      }
      return formatNumber(parsed * 2);
    }
  );
};

const doubleIngredient = (ingredient: Ingredient): Ingredient => ({
  ...ingredient,
  qty: doubleQuantityText(ingredient.qty),
});

const doubleStepData = (step: StepData): StepData => ({
  ...step,
  bullets: step.bullets.map((bullet) => ({
    ...bullet,
    parts: bullet.parts.map((part) =>
      part.type === "ingredient"
        ? { ...part, ingredient: doubleIngredient(part.ingredient) }
        : part
    ),
  })),
  needsNow: step.needsNow.map((entry) =>
    typeof entry.item === "string"
      ? entry
      : { ...entry, item: doubleIngredient(entry.item) }
  ),
  ingredients: step.ingredients.map(doubleIngredient),
});

export default function App() {
  const {
    steps,
    ingredients,
    recipeSummary,
    recipeTitle,
    recipeVersion,
    status,
    hasSelectedRecipe,
    clearRecipeSelection,
    setSampleRecipeSelection,
    setSteps,
  } = useRecipe();
  const { activeView, setActiveView, goCook, goOverview, goReview } = useView();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const {
    focusMode,
    reduceMotion,
    largeText,
    lineSpacing,
    colorIntensity,
    themeMode,
    toggleFocus,
    resetSettings,
  } = useSettings();
  const [timers, setTimers] = useState<TimerItem[]>([]);
  const [showRescue, setShowRescue] = useState(false);
  const [highlightTimes, setHighlightTimes] = useState(false);
  const [highlightTemperatures, setHighlightTemperatures] = useState(false);
  const [splitLongStepsApplied, setSplitLongStepsApplied] = useState(false);
  const [doubleRecipeEnabled, setDoubleRecipeEnabled] = useState(false);

  const getStepBaseTitle = (title: string) =>
    title.replace(/\s+\(part\s+\d+\)$/i, "").trim();

  const withUpdatedNextPreviews = (currentSteps: typeof steps) =>
    currentSteps.map((step, index) => ({
      ...step,
      nextPreview: currentSteps
        .slice(index + 1, index + 4)
        .map((nextStep) => nextStep.title),
    }));

  const splitStepsIntoSmallerSteps = () => {
    const next = steps.flatMap((step) => {
      if (step.bullets.length <= 2) {
        return [step];
      }

      const baseTitle = getStepBaseTitle(step.title);
      const chunks = Array.from(
        { length: Math.ceil(step.bullets.length / 2) },
        (_, chunkIndex) =>
          step.bullets.slice(chunkIndex * 2, chunkIndex * 2 + 2)
      );

      return chunks.map((chunk, index) => ({
        ...step,
        title: `${baseTitle} (part ${index + 1})`,
        bullets: chunk,
        nextPreview: index === chunks.length - 1 ? step.nextPreview : [],
      }));
    });

    setSteps(withUpdatedNextPreviews(next));
    setSplitLongStepsApplied(true);
  };

  const reduceToFewerSteps = () => {
    const mergeGroup = (group: typeof steps) => {
      if (group.length === 0) {
        return [];
      }
      const first = group[0];
      const baseTitle = getStepBaseTitle(first.title);
      const mergedBullets = group.flatMap((step) => step.bullets);
      const mergedIngredients = Array.from(
        new Map(
          group
            .flatMap((step) => step.ingredients)
            .map((ingredient) => [
              `${ingredient.name}-${ingredient.qty}-${ingredient.note}`,
              ingredient,
            ])
        ).values()
      );
      const mergedNeedsNow = Array.from(
        new Map(
          group
            .flatMap((step) => step.needsNow)
            .map((item) => [
              typeof item.item === "string"
                ? `${item.type}-${item.item}`
                : `${item.type}-${item.item.name}-${item.item.qty}-${item.item.note}`,
              item,
            ])
        ).values()
      );

      const mergedStep = {
        ...first,
        title: baseTitle,
        bullets: mergedBullets,
        ingredients: mergedIngredients,
        needsNow: mergedNeedsNow,
        nextPreview: group[group.length - 1]?.nextPreview ?? first.nextPreview,
      };

      const chunks = Array.from(
        { length: Math.ceil(mergedStep.bullets.length / 4) },
        (_, chunkIndex) =>
          mergedStep.bullets.slice(chunkIndex * 4, chunkIndex * 4 + 4)
      );

      return chunks.map((chunk, index) => ({
        ...mergedStep,
        title:
          chunks.length > 1 ? `${baseTitle} (part ${index + 1})` : baseTitle,
        bullets: chunk,
        nextPreview:
          index === chunks.length - 1 ? mergedStep.nextPreview : [],
      }));
    };

    const grouped: typeof steps[] = [];
    steps.forEach((step) => {
      const baseTitle = getStepBaseTitle(step.title);
      const lastGroup = grouped[grouped.length - 1];
      if (!lastGroup) {
        grouped.push([step]);
        return;
      }
      const lastBaseTitle = getStepBaseTitle(lastGroup[0]?.title ?? "");
      if (baseTitle === lastBaseTitle) {
        lastGroup.push(step);
        return;
      }
      grouped.push([step]);
    });

    setSteps(withUpdatedNextPreviews(grouped.flatMap(mergeGroup)));
    setSplitLongStepsApplied(false);
  };

  const handleSplitLongStepsQuickFix = () => {
    if (splitLongStepsApplied) {
      reduceToFewerSteps();
      return;
    }
    splitStepsIntoSmallerSteps();
  };

  const displayIngredients = useMemo(
    () => (doubleRecipeEnabled ? ingredients.map(doubleIngredient) : ingredients),
    [doubleRecipeEnabled, ingredients]
  );

  const displaySteps = useMemo(
    () => (doubleRecipeEnabled ? steps.map(doubleStepData) : steps),
    [doubleRecipeEnabled, steps]
  );

  const activeStep = displaySteps[activeStepIndex] ?? displaySteps[0];
  const progressLabel = `Step ${activeStepIndex + 1} of ${displaySteps.length || 1}`;

  useEffect(() => {
    if (!timers.some((timer) => timer.running)) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimers((current) =>
        current.map((timer) => {
          if (!timer.running || timer.remainingSeconds <= 0) {
            return timer;
          }
          const nextSeconds = Math.max(timer.remainingSeconds - 1, 0);
          return {
            ...timer,
            remainingSeconds: nextSeconds,
            running: nextSeconds > 0,
          };
        })
      );
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timers]);

  const timersRunning = timers.some((timer) => timer.running);
  const currentTimerLabel = timersRunning ? "Timer running" : "No active timer";

  const handleStartTimer = () => {
    const id = `step-${activeStepIndex}`;
    setTimers((current) => {
      const existing = current.find((timer) => timer.id === id);
      if (existing) {
        return current.map((timer) =>
          timer.id === id ? { ...timer, running: !timer.running } : timer
        );
      }
      return [
        {
          id,
          label: `${activeStep.title}`,
          remainingSeconds: activeStep.timerSeconds,
          running: true,
        },
        ...current,
      ];
    });
  };

  const handleNextStep = () => {
    setActiveStepIndex((index) => nextStepIndex(index, displaySteps.length));
  };

  const handlePrevStep = () => {
    setActiveStepIndex((index) => prevStepIndex(index, displaySteps.length));
  };

  const handleRescue = () => {
    setShowRescue(true);
    window.setTimeout(() => setShowRescue(false), 4000);
  };

  const handleCreateNewGuide = () => {
    clearRecipeSelection();
    goOverview();
    resetSettings();
    window.setTimeout(() => {
      document.getElementById("inbox")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const handleOnSeeExample = () => {
    goCook();
    setActiveStepIndex(0);
    setSampleRecipeSelection();
  };

  useEffect(() => {
    if (activeStepIndex >= displaySteps.length && displaySteps.length > 0) {
      setActiveStepIndex(0);
    }
  }, [activeStepIndex, displaySteps.length]);

  useEffect(() => {
    if (status === "loading") {
      setActiveView("processing");
      return;
    }
    if (activeView === "processing" && status === "success") {
      goReview();
    }
    if (activeView === "processing" && status === "error") {
      goOverview();
    }
  }, [activeView, goOverview, goReview, setActiveView, status]);

  useEffect(() => {
    setTimers([]);
    setActiveStepIndex(0);
    setHighlightTimes(false);
    setHighlightTemperatures(false);
    setSplitLongStepsApplied(false);
    setDoubleRecipeEnabled(false);
  }, [recipeVersion]);

  const rootClass = [
    "app-glass-bg text-text font-body",
    themeMode === "light" ? "theme-light" : "theme-dark",
    reduceMotion ? "reduce-motion" : "",
    largeText ? "text-[17px]" : "text-[15px] md:text-base",
    colorIntensity === "extra-contrast" ? "extra-contrast" : "standard-contrast",
  ]
    .filter(Boolean)
    .join(" ");

  const viewTitleMap: Record<ViewKey, string> = {
    overview: "Get Started",
    processing: "Processing",
    review: "Review",
    cook: "Cook Mode",
    library: "Saved guides",
    settings: "Settings",
  };

  const appShellProps = useMemo(
    () => ({
      viewTitle: viewTitleMap[activeView],
      progressLabel,
      focusMode,
      onToggleFocus: toggleFocus,
    }),
    [activeView, focusMode, progressLabel, toggleFocus]
  );

  return (
    <div className={rootClass} data-line-spacing={lineSpacing}>
      {activeView === "overview" && (
        <HeroAboveTheFold
          themeMode={themeMode}
          onCreateNewGuide={() => handleCreateNewGuide()}
          onSeeExample={() => handleOnSeeExample()}
        />
      )}
      <AppShell>
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-20 pt-6 md:px-10">
          {activeView === "cook" ||
          activeView === "review" ||
          activeView === "library" ||
          activeView === "settings" ? (
            <TopBar
              {...appShellProps}
              isCook={activeView === "cook"}
              showSaveGuideActions={
                activeView === "cook" || activeView === "review"
              }
            />
          ) : null}

          <main className="mt-2 md:mt-6 space-y-4 md:space-y-6">
            <MobileView
              steps={displaySteps}
              ingredients={displayIngredients}
              recipeSummary={recipeSummary}
              quickFixes={quickFixes}
              hasSelectedRecipe={hasSelectedRecipe}
              recipeTitle={recipeTitle}
              onCreateNewGuide={handleCreateNewGuide}
              focusMode={focusMode}
              progressLabel={progressLabel}
              currentTimerLabel={currentTimerLabel}
              activeStep={activeStep}
              onPrev={handlePrevStep}
              onNext={handleNextStep}
              onStartTimer={handleStartTimer}
              onRescue={handleRescue}
              timers={timers}
              showRescue={showRescue}
              highlightTimes={highlightTimes}
              highlightTemperatures={highlightTemperatures}
              onToggleHighlightTimes={() =>
                setHighlightTimes((current) => !current)
              }
              onToggleHighlightTemperatures={() =>
                setHighlightTemperatures((current) => !current)
              }
              splitLongStepsApplied={splitLongStepsApplied}
              onSplitLongStepsQuickFix={handleSplitLongStepsQuickFix}
              doubleRecipeEnabled={doubleRecipeEnabled}
              onToggleDoubleRecipe={() =>
                setDoubleRecipeEnabled((current) => !current)
              }
            />
          </main>
        </div>
      </AppShell>
      <FooterBelowTheFold themeMode={themeMode} />

      <BottomNav />
    </div>
  );
}
