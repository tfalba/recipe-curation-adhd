import { useEffect, useMemo, useState } from "react";
import {
  AppShell,
  BottomNav,
  MobileView,
  TopBar,
} from "./components";
import type { TimerItem, ViewKey } from "./components";
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

  const getStepBaseTitle = (title: string) =>
    title.replace(/\s+\(part\s+\d+\)$/i, "").trim();

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

    setSteps(next);
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

    setSteps(grouped.flatMap(mergeGroup));
    setSplitLongStepsApplied(false);
  };

  const handleSplitLongStepsQuickFix = () => {
    if (splitLongStepsApplied) {
      reduceToFewerSteps();
      return;
    }
    splitStepsIntoSmallerSteps();
  };

  const activeStep = steps[activeStepIndex] ?? steps[0];
  const progressLabel = `Step ${activeStepIndex + 1} of ${steps.length || 1}`;

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
          label: `${activeStep.title} timer`,
          remainingSeconds: activeStep.timerSeconds,
          running: true,
        },
        ...current,
      ];
    });
  };

  const handleNextStep = () => {
    setActiveStepIndex((index) => nextStepIndex(index, steps.length));
  };

  const handlePrevStep = () => {
    setActiveStepIndex((index) => prevStepIndex(index, steps.length));
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
    if (activeStepIndex >= steps.length && steps.length > 0) {
      setActiveStepIndex(0);
    }
  }, [activeStepIndex, steps.length]);

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
          {activeView === "cook" || activeView === "review" ? (
            <TopBar
              {...appShellProps}
              isCook={activeView === "cook"}
            />
          ) : null}

          <main className="mt-2 md:mt-6 space-y-4 md:space-y-6">
            <MobileView
              steps={steps}
              ingredients={ingredients}
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
            />
          </main>
        </div>
      </AppShell>
      <FooterBelowTheFold themeMode={themeMode} />

      <BottomNav />
    </div>
  );
}
