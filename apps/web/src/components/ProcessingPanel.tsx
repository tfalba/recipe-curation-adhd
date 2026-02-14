import boilingVideo from "../assets/water-boiling.mp4";

const stages = [
  "Parsing the recipe text",
  "Structuring ingredients",
  "Simplifying instructions",
  "Building Cook Mode",
];

export default function ProcessingPanel() {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-panel">
      <div className="flex h-60 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-2">
        <video
          className="h-full w-full object-cover"
          src={boilingVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Processing
          </p>
          <h3 className="text-xl font-display font-semibold">
            Parsing {'>'} Structuring {'>'} Simplifying {'>'} Building guide
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
