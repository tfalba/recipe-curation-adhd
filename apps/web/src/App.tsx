import { useEffect, useMemo, useState } from "react";

type ViewKey = "inbox" | "processing" | "review" | "cook" | "library" | "settings";

type StepData = {
  title: string;
  bullets: string[];
  chips: string[];
  timerSeconds: number;
  needsNow: string[];
  nextPreview: string[];
  summary: string;
};

type Ingredient = {
  name: string;
  qty: string;
  note: string;
};

type TimerItem = {
  id: string;
  label: string;
  remainingSeconds: number;
  running: boolean;
};

const steps: StepData[] = [
  {
    title: "Sear the chicken",
    bullets: [
      "Pat dry, season with salt + pepper.",
      "Sear 3 minutes per side until golden.",
      "Move to plate, keep drippings.",
    ],
    chips: ["6 min", "Medium heat", "Skillet"],
    timerSeconds: 360,
    needsNow: ["Chicken thighs", "Olive oil", "Skillet", "Tongs"],
    nextPreview: ["Saute garlic", "Whisk in broth + lemon", "Simmer briefly"],
    summary: "Sear chicken until golden, then set aside.",
  },
  {
    title: "Build the sauce",
    bullets: [
      "Saute garlic 30 seconds until fragrant.",
      "Whisk in broth + lemon zest.",
      "Simmer until glossy, about 3 minutes.",
    ],
    chips: ["5 min", "Low heat", "Whisk"],
    timerSeconds: 300,
    needsNow: ["Garlic", "Lemon zest", "Broth", "Whisk"],
    nextPreview: ["Return chicken", "Spoon sauce over", "Top with parsley"],
    summary: "Whisk together lemony sauce until glossy.",
  },
  {
    title: "Finish and serve",
    bullets: ["Return chicken to pan.", "Spoon sauce over.", "Top with parsley."],
    chips: ["2 min", "Warm", "Tongs"],
    timerSeconds: 120,
    needsNow: ["Chicken", "Parsley", "Serving plates"],
    nextPreview: ["Serve", "Enjoy"],
    summary: "Finish with sauce and herbs, then serve.",
  },
];

const ingredients: Ingredient[] = [
  { name: "Chicken thighs", qty: "1.5 lb", note: "patted dry" },
  { name: "Olive oil", qty: "2 tbsp", note: "divided" },
  { name: "Garlic", qty: "3 cloves", note: "minced" },
  { name: "Chicken broth", qty: "1 cup", note: "low sodium" },
  { name: "Lemon", qty: "1", note: "zest + juice" },
  { name: "Parsley", qty: "2 tbsp", note: "chopped" },
];

const quickFixes = [
  "Split long steps",
  "Convert to bullets",
  "Normalize units",
  "Highlight times/temps",
];

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

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
      activeView,
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
      <AppShell {...appShellProps}>
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

function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}

function TopBar({
  viewTitle,
  progressLabel,
  focusMode,
  onToggleFocus,
  onOpenSettings,
  isCook,
  isMobile,
}: {
  viewTitle: string;
  progressLabel: string;
  focusMode: boolean;
  onToggleFocus: () => void;
  onOpenSettings: () => void;
  isCook: boolean;
  isMobile: boolean;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-surface/90 px-5 py-4 shadow-panel backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-primary">
          RQ
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Recipe Quest
          </p>
          <p className="text-lg font-display font-semibold">
            {isMobile ? viewTitle : "Lemon Skillet Chicken"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isCook ? (
          <span className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {progressLabel}
          </span>
        ) : (
          <span className="rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            {viewTitle}
          </span>
        )}
        <button
          onClick={onToggleFocus}
          className={`min-h-[44px] rounded-2xl border border-border px-4 text-sm font-semibold transition duration-quick ease-snappy ${
            focusMode
              ? "bg-accent/20 text-accent"
              : "bg-surface-2 text-muted hover:text-text"
          }`}
        >
          Focus
        </button>
        <button
          onClick={onOpenSettings}
          className="min-h-[44px] rounded-2xl border border-border bg-surface-2 px-4 text-sm font-semibold text-muted transition duration-quick ease-snappy hover:text-text"
        >
          Settings
        </button>
        <button className="min-h-[44px] rounded-2xl bg-primary px-5 text-sm font-semibold text-white shadow-focus transition duration-quick ease-snappy hover:translate-y-[-1px]">
          Save Guide
        </button>
      </div>
    </header>
  );
}

function InboxPanel() {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Inbox</p>
          <h2 className="text-2xl font-display font-semibold">
            Paste a recipe. We build the guide.
          </h2>
          <p className="mt-2 text-sm text-muted">
            We keep steps short, one screen at a time. You can edit anything.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="min-h-[44px] rounded-2xl border border-border bg-surface-2 px-4 text-sm font-semibold text-muted">
            Paste URL
          </button>
          <button className="min-h-[44px] rounded-2xl border border-border bg-surface-2 px-4 text-sm font-semibold text-muted">
            Upload
          </button>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-surface-2 p-4">
        <textarea
          className="h-40 w-full resize-none bg-transparent text-sm text-text focus:outline-none"
          placeholder="Paste recipe text here..."
        />
      </div>
      <button className="mt-4 w-full min-h-[44px] rounded-2xl bg-accent px-4 text-sm font-semibold text-black shadow-glow transition duration-quick ease-snappy hover:translate-y-[-1px]">
        Turn this into a cooking guide
      </button>
    </section>
  );
}

function ProcessingPanel() {
  const stages = [
    "Parsing the recipe text",
    "Structuring ingredients",
    "Simplifying instructions",
    "Building Cook Mode",
  ];

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Processing
          </p>
          <h3 className="text-xl font-display font-semibold">
            Parsing → Structuring → Simplifying → Building guide
          </h3>
        </div>
        <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted">
          42% complete
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {stages.map((label) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm"
          >
            <span>{label}</span>
            <span className="text-accent">●</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewPanel({
  steps,
  ingredients,
  quickFixes,
}: {
  steps: StepData[];
  ingredients: Ingredient[];
  quickFixes: string[];
}) {
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
            <button className="mt-4 min-h-[36px] w-full rounded-2xl bg-primary px-4 text-sm font-semibold text-white">
              Generate Cook Mode
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

function CookPanel({
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
}: {
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
}) {
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
          focusMode ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_280px]"
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
          <div className="mt-4 flex flex-wrap gap-2">
            {activeStep.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted"
              >
                {chip}
              </span>
            ))}
          </div>
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
              <p className="mt-2 text-sm text-text">
                {activeStep.summary}
              </p>
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
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-muted">
                {activeStep.needsNow.map((item) => (
                  <li key={item}>{item}</li>
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

function LibraryPanel() {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Saved Guides
          </p>
          <h3 className="text-xl font-display font-semibold">
            Library for fast re-cooks
          </h3>
        </div>
        <button className="min-h-[44px] rounded-2xl bg-primary px-4 text-sm font-semibold text-white">
          New paste
        </button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {["15-min miso noodles", "Sheet-pan salmon", "Crispy tofu bowls"].map(
          (title) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-surface-2 p-4"
            >
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-2 text-xs text-muted">Last cooked 2 days ago</p>
              <div className="mt-3 flex gap-2">
                <button className="min-h-[36px] flex-1 rounded-full border border-border bg-bg text-xs text-muted">
                  Edit
                </button>
                <button className="min-h-[36px] flex-1 rounded-full bg-accent text-xs font-semibold text-black">
                  Cook
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

function WhyPanel() {
  return (
    <section className="rounded-3xl border border-border bg-surface p-5 shadow-panel">
      <h4 className="text-lg font-display font-semibold">Why this helps</h4>
      <ul className="mt-4 list-disc space-y-3 pl-4 text-sm text-muted">
        <li>One step per screen.</li>
        <li>Timers stay visible.</li>
        <li>Clear success + warning cues.</li>
        <li>Distraction rescue always on.</li>
      </ul>
      <button className="mt-4 w-full min-h-[44px] rounded-2xl border border-border bg-surface-2 px-4 text-sm font-semibold text-muted">
        See full accessibility
      </button>
    </section>
  );
}

function SettingsPanel({
  focusMode,
  reduceMotion,
  largeText,
  lineSpacing,
  soundOn,
  colorIntensity,
  onToggleFocus,
  onToggleReduceMotion,
  onToggleLargeText,
  onToggleSound,
  onChangeLineSpacing,
  onChangeColorIntensity,
}: {
  focusMode: boolean;
  reduceMotion: boolean;
  largeText: boolean;
  lineSpacing: "normal" | "roomy";
  soundOn: boolean;
  colorIntensity: "standard" | "extra-contrast";
  onToggleFocus: () => void;
  onToggleReduceMotion: () => void;
  onToggleLargeText: () => void;
  onToggleSound: () => void;
  onChangeLineSpacing: (value: "normal" | "roomy") => void;
  onChangeColorIntensity: (value: "standard" | "extra-contrast") => void;
}) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-5 shadow-panel">
      <h4 className="text-lg font-display font-semibold">
        Settings + Accessibility
      </h4>
      <div className="mt-4 space-y-3">
        <SettingRow
          label="Focus Mode default"
          value={focusMode ? "On" : "Off"}
          onClick={onToggleFocus}
          active={focusMode}
        />
        <SettingRow
          label="Reduce motion"
          value={reduceMotion ? "On" : "Off"}
          onClick={onToggleReduceMotion}
          active={reduceMotion}
        />
        <SettingRow
          label="Large text"
          value={largeText ? "On" : "Off"}
          onClick={onToggleLargeText}
          active={largeText}
        />
        <SettingRow
          label="Sound on timer"
          value={soundOn ? "On" : "Off"}
          onClick={onToggleSound}
          active={soundOn}
        />
        <SettingRow
          label="Line spacing"
          value={lineSpacing === "roomy" ? "Roomy" : "Normal"}
          onClick={() =>
            onChangeLineSpacing(lineSpacing === "roomy" ? "normal" : "roomy")
          }
          active={lineSpacing === "roomy"}
        />
        <SettingRow
          label="Color intensity"
          value={colorIntensity === "extra-contrast" ? "Extra" : "Standard"}
          onClick={() =>
            onChangeColorIntensity(
              colorIntensity === "extra-contrast"
                ? "standard"
                : "extra-contrast"
            )
          }
          active={colorIntensity === "extra-contrast"}
        />
      </div>
    </section>
  );
}

function SettingRow({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border border-border px-3 py-3 text-sm ${
        active ? "bg-accent/20 text-accent" : "bg-surface-2 text-muted"
      }`}
    >
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </button>
  );
}

function MobileView({
  view,
  steps,
  ingredients,
  quickFixes,
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
  settingsProps,
}: {
  view: ViewKey;
  steps: StepData[];
  ingredients: Ingredient[];
  quickFixes: string[];
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
  settingsProps: React.ComponentProps<typeof SettingsPanel>;
}) {
  switch (view) {
    case "processing":
      return <ProcessingPanel />;
    case "review":
      return (
        <ReviewPanel
          steps={steps}
          ingredients={ingredients}
          quickFixes={quickFixes}
        />
      );
    case "cook":
      return (
        <CookPanel
          focusMode={focusMode}
          progressLabel={progressLabel}
          currentTimerLabel={currentTimerLabel}
          activeStep={activeStep}
          onPrev={onPrev}
          onNext={onNext}
          onStartTimer={onStartTimer}
          onRescue={onRescue}
          timers={timers}
          showRescue={showRescue}
        />
      );
    case "library":
      return <LibraryPanel />;
    case "settings":
      return <SettingsPanel {...settingsProps} />;
    default:
      return <InboxPanel />;
  }
}

function BottomNav({
  activeView,
  onChange,
}: {
  activeView: ViewKey;
  onChange: (view: ViewKey) => void;
}) {
  const items: { key: ViewKey; label: string }[] = [
    { key: "inbox", label: "Inbox" },
    { key: "review", label: "Review" },
    { key: "cook", label: "Cook" },
    { key: "library", label: "Library" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-border bg-surface/90 px-4 py-3 text-xs text-muted backdrop-blur lg:hidden">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
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
