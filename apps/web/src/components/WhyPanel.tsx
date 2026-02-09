export default function WhyPanel() {
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
