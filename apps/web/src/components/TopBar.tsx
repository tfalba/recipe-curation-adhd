type TopBarProps = {
  viewTitle: string;
  progressLabel: string;
  focusMode: boolean;
  onToggleFocus: () => void;
  onOpenSettings: () => void;
  isCook: boolean;
  isMobile: boolean;
};

export default function TopBar({
  viewTitle,
  progressLabel,
  focusMode,
  onToggleFocus,
  onOpenSettings,
  isCook,
  isMobile,
}: TopBarProps) {
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
