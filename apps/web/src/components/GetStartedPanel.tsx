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
              className="min-h-[56px] rounded-3xl bg-violet/80 px-4 text-sm font-semibold text-white shadow-panel transition duration-quick ease-snappy hover:translate-y-[-1px]"
            >
              Review
            </button>
            <button
              onClick={onCookGuide}
              className="min-h-[56px] rounded-3xl bg-accent px-4 text-sm font-semibold text-black shadow-glow transition duration-quick ease-snappy hover:translate-y-[-1px]"
            >
              Let&apos;s cook
            </button>
          </div>
        </div>
      </div>
       <button
            onClick={onCreateNewGuide}
            className="mt-6 min-h-[56px] w-full rounded-3xl bg-primary/20 px-4 text-left text-lg font-semibold text-white/80 shadow-glow transition duration-quick ease-snappy hover:translate-y-[-1px]"
          >
            Create a new guide from any recipe...
          </button>
    </section>
  );
}
