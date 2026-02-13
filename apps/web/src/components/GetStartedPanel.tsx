type GetStartedPanelProps = {
  recipeTitle: string;
  onCreateNewGuide: () => void;
  onReviewGuide: () => void;
  onCookGuide: () => void;
};

export default function GetStartedPanel({
  recipeTitle,
  onCreateNewGuide,
  onReviewGuide,
  onCookGuide,
}: GetStartedPanelProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-panel">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-border bg-surface-2 p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Current Guide
          </p>
          <h2 className="mt-3 text-2xl font-display font-semibold text-text">
            {recipeTitle}
          </h2>
          <p className="mt-3 text-sm text-muted">
            Pick where you want to jump back in.
          </p>
         
        </div>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={onReviewGuide}
              className="min-h-[56px] max-h-[56px] rounded-3xl border border-violet/50 bg-violet/70 px-4 text-sm font-semibold shadow-panel transition duration-quick ease-snappy hover:translate-y-[-2px] hover:shadow-glow"
            >
              Review
            </button>
            <button
              onClick={onCookGuide}
              className="min-h-[56px] max-h-[56px] rounded-3xl bg-accent/90 border border-accent px-4 text-sm font-semibold text-bg shadow-panel transition duration-quick ease-snappy hover:translate-y-[-2px] hover:shadow-glow"
            >
              Let&apos;s cook
            </button>
          </div>
        </div>
      </div>
       <button
            onClick={onCreateNewGuide}
            className="mt-6 min-h-[56px] p-4 w-full rounded-3xl bg-primary/90 px-4 text-left text-lg font-semibold text-text shadow-panel transition duration-quick ease-snappy hover:translate-y-[-1px] hover:shadow-glow"
          >
            Create a new guide from any recipe...
          </button>
    </section>
  );
}
