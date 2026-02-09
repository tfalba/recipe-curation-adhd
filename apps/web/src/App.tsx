import { useEffect, useMemo, useState } from "react";
import AppShell from "./components/AppShell";
import BottomNav from "./components/BottomNav";
import CookPanel from "./components/CookPanel";
import InboxPanel from "./components/InboxPanel";
import LibraryPanel from "./components/LibraryPanel";
import MobileView from "./components/MobileView";
import ProcessingPanel from "./components/ProcessingPanel";
import ReviewPanel from "./components/ReviewPanel";
import SettingsPanel from "./components/SettingsPanel";
import TopBar from "./components/TopBar";
import WhyPanel from "./components/WhyPanel";
import type { TimerItem, ViewKey } from "./components/types";
import { ingredients, quickFixes, steps } from "./data";

const nextStepIndex = (index: number) => (index + 1) % steps.length;
const prevStepIndex = (index: number) =>
  (index - 1 + steps.length) % steps.length;

export default function App() {
  const [activeView, setActiveView] = useState<ViewKey>("inbox");
  const [activeStepIndex, setActiveStepIndex] = useState(1);
  const [focusMode, setFocusMode] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [lineSpacing, setLineSpacing] = useState<"normal" | "roomy">("roomy");
  const [soundOn, setSoundOn] = useState(true);
  const [colorIntensity, setColorIntensity] = useState<
    "standard" | "extra-contrast"
  >("extra-contrast");
  const [timers, setTimers] = useState<TimerItem[]>([
    {
      id: "sauce",
      label: "Sauce simmer",
      remainingSeconds: 134,
      running: true,
    },
    {
      id: "rest",
      label: "Chicken rest",
      remainingSeconds: 220,
      running: false,
    },
  ]);
  const [showRescue, setShowRescue] = useState(false);

  const activeStep = steps[activeStepIndex];
  const progressLabel = `Step ${activeStepIndex + 1} of ${steps.length}`;

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
    setActiveStepIndex((index) => nextStepIndex(index));
  };

  const handlePrevStep = () => {
    setActiveStepIndex((index) => prevStepIndex(index));
  };

  const handleRescue = () => {
    setShowRescue(true);
    window.setTimeout(() => setShowRescue(false), 2400);
  };

  const rootClass = [
    "min-h-screen bg-bg text-text font-body",
    reduceMotion ? "reduce-motion" : "",
    largeText ? "text-[17px]" : "text-[15px] md:text-base",
    colorIntensity === "extra-contrast" ? "extra-contrast" : "standard-contrast",
  ]
    .filter(Boolean)
    .join(" ");

  const viewTitleMap: Record<ViewKey, string> = {
    inbox: "Paste recipe",
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
      onOpenSettings: () => setActiveView("settings"),
    }),
    [activeView, focusMode, progressLabel]
  );

  return (
    <div className={rootClass} data-line-spacing={lineSpacing}>
      <AppShell>
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-20 pt-6 md:px-10">
          <TopBar
            {...appShellProps}
            isCook={activeView === "cook"}
            isMobile={false}
          />

          <main className="mt-8 hidden gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className="space-y-6">
              <InboxPanel />
              <ProcessingPanel />
              <ReviewPanel
                steps={steps}
                ingredients={ingredients}
                quickFixes={quickFixes}
              />
              <CookPanel
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
              />
              <LibraryPanel />
            </section>

            <aside className="space-y-6">
              <WhyPanel />
              <SettingsPanel
                focusMode={focusMode}
                reduceMotion={reduceMotion}
                largeText={largeText}
                lineSpacing={lineSpacing}
                soundOn={soundOn}
                colorIntensity={colorIntensity}
                onToggleFocus={() => setFocusMode((value) => !value)}
                onToggleReduceMotion={() => setReduceMotion((value) => !value)}
                onToggleLargeText={() => setLargeText((value) => !value)}
                onToggleSound={() => setSoundOn((value) => !value)}
                onChangeLineSpacing={setLineSpacing}
                onChangeColorIntensity={setColorIntensity}
              />
            </aside>
          </main>

          <main className="mt-6 space-y-6 lg:hidden">
            <MobileView
              view={activeView}
              steps={steps}
              ingredients={ingredients}
              quickFixes={quickFixes}
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
                onToggleFocus: () => setFocusMode((value) => !value),
                onToggleReduceMotion: () => setReduceMotion((value) => !value),
                onToggleLargeText: () => setLargeText((value) => !value),
                onToggleSound: () => setSoundOn((value) => !value),
                onChangeLineSpacing: setLineSpacing,
                onChangeColorIntensity: setColorIntensity,
              }}
            />
          </main>
        </div>
      </AppShell>

      <BottomNav activeView={activeView} onChange={setActiveView} />
    </div>
  );
}
