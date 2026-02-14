import type { ComponentProps } from "react";
import type { Ingredient, StepData, TimerItem } from "./types";
import CookPanel from "./CookPanel";
import GetStartedPanel from "./GetStartedPanel";
import InboxPanel from "./InboxPanel";
import LibraryPanel from "./LibraryPanel";
import ProcessingPanel from "./ProcessingPanel";
import ReviewPanel from "./ReviewPanel";
import SettingsPanel from "./SettingsPanel";
import WhyPanel from "./WhyPanel";
import { useView } from "../view/ViewContext";

type MobileViewProps = {
  steps: StepData[];
  ingredients: Ingredient[];
  quickFixes: string[];
  hasSelectedRecipe: boolean;
  recipeTitle: string;
  onCreateNewGuide: () => void;
  onCreateNewRecipe: () => void;
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
  steps,
  ingredients,
  quickFixes,
  hasSelectedRecipe,
  recipeTitle,
  onCreateNewGuide,
  onCreateNewRecipe,
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
  const { activeView, goReview, goCook } = useView();
  switch (activeView) {
    case "processing":
      return <ProcessingPanel />;
    case "overview":
      return hasSelectedRecipe ? (
        <GetStartedPanel
          recipeTitle={recipeTitle}
          onCreateNewGuide={onCreateNewGuide}
          onReviewGuide={goReview}
          onCookGuide={goCook}
        />
      ) : (
        <section className="space-y-6">
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
          onGenerateCookMode={goCook}
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
      return (
        <LibraryPanel
          onSelectRecipeReview={goReview}
          onSelectRecipeCook={goCook}
          onCreateNewRecipe={onCreateNewRecipe}
        />
      );
    case "settings":
      return <SettingsPanel {...settingsProps} />;
    default:
      return <WhyPanel />;
  }
}
