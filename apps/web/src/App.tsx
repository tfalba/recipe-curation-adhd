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

const nextStepIndex = (index: number, total: number) =>
  total === 0 ? 0 : (index + 1) % total;
const prevStepIndex = (index: number, total: number) =>
  total === 0 ? 0 : (index - 1 + total) % total;

export default function App() {
  const {
    steps,
    ingredients,
    recipeTitle,
    recipeVersion,
    status,
    hasSelectedRecipe,
    recipeSource,
    clearRecipeSelection,
  } = useRecipe();
  const [activeView, setActiveView] = useState<ViewKey>("overview");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [lineSpacing, setLineSpacing] = useState<"normal" | "roomy">("roomy");
  const [soundOn, setSoundOn] = useState(true);
  const [colorIntensity, setColorIntensity] = useState<
    "standard" | "extra-contrast"
  >("extra-contrast");
  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }
    const stored = window.localStorage.getItem("recipe-theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark").matches
      ? "dark"
      : "light";
  });
  const [timers, setTimers] = useState<TimerItem[]>([]);
  const [showRescue, setShowRescue] = useState(false);

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

  const resetUiDefaults = () => {
    setTimers([]);
    setActiveStepIndex(0);
    setShowRescue(false);
    setFocusMode(false);
    setReduceMotion(false);
    setLargeText(false);
    setLineSpacing("roomy");
    setSoundOn(true);
    setColorIntensity("extra-contrast");
    setThemeMode("dark");
  };

  const handleCreateNewGuide = () => {
    clearRecipeSelection();
    resetUiDefaults();
    setActiveView("overview");
    window.setTimeout(() => {
      document.getElementById("inbox")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  useEffect(() => {
    if (activeStepIndex >= steps.length && steps.length > 0) {
      setActiveStepIndex(0);
    }
  }, [activeStepIndex, steps.length]);

  useEffect(() => {
    window.localStorage.setItem("recipe-theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    setTimers([]);
    setActiveStepIndex(0);
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
      onToggleFocus: () => setFocusMode((value) => !value),
    }),
    [activeView, focusMode, progressLabel]
  );

  return (
    <div className={rootClass} data-line-spacing={lineSpacing}>
      {activeView === "overview" && (
        <HeroAboveTheFold
          themeMode={themeMode}
          onCreateNewGuide={() => handleCreateNewGuide()}
          onSeeExample={() => setActiveView("cook")}
        />
      )}
      <AppShell>
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-20 pt-6 md:px-10">
          <TopBar
            {...appShellProps}
            recipeTitle={status === "loading" ? "Building guide..." : recipeTitle}
            isCook={activeView === "cook"}
            showSaveGuide={recipeSource === "generated" && status === "success"}
          />

          <main className="mt-2 md:mt-6 space-y-4 md:space-y-6">
            <MobileView
              view={activeView}
              steps={steps}
              ingredients={ingredients}
              quickFixes={quickFixes}
              hasSelectedRecipe={hasSelectedRecipe}
              recipeTitle={recipeTitle}
              onCreateNewGuide={() => {
                handleCreateNewGuide();
              }}
              onCreateNewRecipe={handleCreateNewGuide}
              onReviewGuide={() => setActiveView("review")}
              onCookGuide={() => setActiveView("cook")}
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
              settingsProps={{
                focusMode,
                reduceMotion,
                largeText,
                lineSpacing,
                soundOn,
                colorIntensity,
                themeMode,
                onToggleFocus: () => setFocusMode((value) => !value),
                onToggleReduceMotion: () => setReduceMotion((value) => !value),
                onToggleLargeText: () => setLargeText((value) => !value),
                onToggleSound: () => setSoundOn((value) => !value),
                onToggleTheme: () =>
                  setThemeMode((value) => (value === "dark" ? "light" : "dark")),
                onChangeLineSpacing: setLineSpacing,
                onChangeColorIntensity: setColorIntensity,
              }}
            />
          </main>
        </div>
      </AppShell>
      <FooterBelowTheFold themeMode={themeMode} />

      <BottomNav activeView={activeView} onChange={setActiveView} />
    </div>
  );
}
