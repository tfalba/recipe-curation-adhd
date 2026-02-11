import backgroundHero from "../assets/genius-kitchen.jpg"

export function HeroAboveTheFold() {
  return (
    <section className="relative overflow-hidden bg-bg text-text">
      {/* Background image (Prompt 1) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{ backgroundImage: `url(${backgroundHero})` }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-1 md:items-start">
          <div className="md:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-sm text-muted">
              <span className="h-2 w-2 rounded-full bg-accent shadow-glow" />
              Built for focus in the kitchen
            </div>

            <h1 className="font-display text-4xl md:text-6xl leading-tight">
              Cook one clear step <span className="text-muted">at a time.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted max-w-xl">
              Paste any recipe. We turn it into a distraction-friendly cooking guide:
              short steps, ingredient callouts, and timers—so you keep moving.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="h-[44px] px-6 rounded-2xl bg-primary text-white font-semibold shadow-panel hover:opacity-90 transition-normal">
                Turn recipe into a cooking guide
              </button>

              <button className="h-[44px] px-6 rounded-2xl border border-border bg-surface/40 text-text hover:bg-surface-2 transition-normal">
                See an example
              </button>
            </div>

            {/* Trust + reassurance */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted">
              <span>✓ Edit anything before you start</span>
              <span>✓ No walls of text in Cook Mode</span>
              <span>✓ Progress + “Where was I?” rescue</span>
            </div>

            {/* Tiny “how it works” */}
            <div className="pt-4 grid grid-cols-3 gap-3 max-w-xl">
              {[
                { title: "Paste", desc: "Any recipe text" },
                { title: "Review", desc: "Quick auto-fixes" },
                { title: "Cook", desc: "One step per screen" },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-2xl border border-border bg-surface/45 p-4 shadow-panel"
                >
                  <div className="font-semibold">{x.title}</div>
                  <div className="text-sm text-muted mt-1">{x.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product preview (Paste Inbox + Cook Player mock) */}
          <div className="md:col-span-6">

            {/* Footnote below preview */}
            <div className="mt-4 text-sm text-muted">
              Optimized for low-glare kitchen use • big tap targets • thick focus rings
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
