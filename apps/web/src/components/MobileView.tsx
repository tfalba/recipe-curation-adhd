import type { Ingredient, RecipeSummary, StepData, TimerItem } from "./types";
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
  recipeSummary: RecipeSummary;
  quickFixes: string[];
  hasSelectedRecipe: boolean;
  recipeTitle: string;
  onCreateNewGuide: () => void;
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
  onToggleHighlightTimes: () => void;
  onToggleHighlightTemperatures: () => void;
  splitLongStepsApplied: boolean;
  onSplitLongStepsQuickFix: () => void;
};

export default function MobileView({
  steps,
  ingredients,
  recipeSummary,
  quickFixes,
  hasSelectedRecipe,
  recipeTitle,
  onCreateNewGuide,
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
  onToggleHighlightTimes,
  onToggleHighlightTemperatures,
  splitLongStepsApplied,
  onSplitLongStepsQuickFix,
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
          recipeSummary={recipeSummary}
          quickFixes={quickFixes}
          onGenerateCookMode={goCook}
          highlightTimes={highlightTimes}
          highlightTemperatures={highlightTemperatures}
          onToggleHighlightTimes={onToggleHighlightTimes}
          onToggleHighlightTemperatures={onToggleHighlightTemperatures}
          splitLongStepsApplied={splitLongStepsApplied}
          onSplitLongStepsQuickFix={onSplitLongStepsQuickFix}
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
          highlightTimes={highlightTimes}
          highlightTemperatures={highlightTemperatures}
        />
      );
    case "library":
      return (
        <LibraryPanel
          onSelectRecipeReview={goReview}
          onSelectRecipeCook={goCook}
          onCreateNewGuide={onCreateNewGuide}
        />
      );
    case "settings":
      return <SettingsPanel />;
    default:
      return <WhyPanel />;
  }
}
