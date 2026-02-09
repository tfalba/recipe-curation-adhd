export default function InboxPanel() {
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
