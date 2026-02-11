import type { ComponentProps } from "react";
import type { Ingredient, StepData, TimerItem, ViewKey } from "./types";
import CookPanel from "./CookPanel";
import GetStartedPanel from "./GetStartedPanel";
import InboxPanel from "./InboxPanel";
import LibraryPanel from "./LibraryPanel";
import ProcessingPanel from "./ProcessingPanel";
import ReviewPanel from "./ReviewPanel";
import SettingsPanel from "./SettingsPanel";
import WhyPanel from "./WhyPanel";

type MobileViewProps = {
  view: ViewKey;
  steps: StepData[];
  ingredients: Ingredient[];
  quickFixes: string[];
  hasSelectedRecipe: boolean;
  recipeTitle: string;
  onCreateNewGuide: () => void;
  onReviewGuide: () => void;
  onCookGuide: () => void;
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
  settingsProps: ComponentProps<typeof SettingsPanel>;
};

export default function MobileView({
  view,
  steps,
  ingredients,
  quickFixes,
  hasSelectedRecipe,
  recipeTitle,
  onCreateNewGuide,
  onReviewGuide,
  onCookGuide,
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
}: MobileViewProps) {
  switch (view) {
    case "processing":
      return <ProcessingPanel />;
    case "overview":
      return hasSelectedRecipe ? (
        <GetStartedPanel
          recipeTitle={recipeTitle}
          onCreateNewGuide={onCreateNewGuide}
          onReviewGuide={onReviewGuide}
          onCookGuide={onCookGuide}
        />
      ) : (
        <section>
          <InboxPanel />
          <WhyPanel />
        </section>
      );
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
      return <WhyPanel />;
  }
}
