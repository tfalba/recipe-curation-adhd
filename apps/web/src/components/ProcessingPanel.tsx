import { useEffect, useMemo, useState } from "react";
import boilingVideo from "../assets/water-boiling.mp4";

const stages = [
  "Parsing the recipe text",
  "Structuring ingredients",
  "Simplifying instructions",
  "Building Cook Mode",
] as const;

export default function ProcessingPanel() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    setStageIndex(0);
    const interval = window.setInterval(() => {
      setStageIndex((current) => Math.min(current + 1, stages.length - 1));
    }, 9800);

    return () => window.clearInterval(interval);
  }, []);

  const percentComplete = useMemo(() => {
    const base = Math.round(((stageIndex + 1) / stages.length) * 100);
    return Math.min(base, 95);
  }, [stageIndex]);

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Processing
          </p>
          <h3 className="text-xl font-display font-semibold">
            Parsing {'>'} Structuring {'>'} Simplifying {'>'} Building guide
          </h3>
        </div>
        <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted">
          {percentComplete}% complete
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {stages.map((label, index) => (
          <div
            key={label}
            className={`flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm ${
              index <= stageIndex ? "bg-surface-2 text-text" : "bg-surface text-muted"
            }`}
          >
            <span>{label}</span>
            <span className={index <= stageIndex ? "text-accent" : "text-muted"}>
              ●
            </span>
          </div>
        ))}
      </div>
      <div className="flex h-72 mt-4 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-2">
        <video
          className="h-full w-full object-cover"
          src={boilingVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </section>
  );
}
