import backgroundHero from "../assets/genius-kitchen.jpg";
import backgroundHeroLight6 from "../assets/daria-yakovleva-cooking-2132874_1920.jpg";
import backgroundHeroLight from "../assets/congerdesign-waffles-2190961_1920.jpg";
import backgroundHeroLight2 from "../assets/congerdesign-mushrooms-756406_1920.jpg";

type HeroAboveTheFoldProps = {
  themeMode: "dark" | "light";
  onCreateNewGuide: () => void;
  onSeeExample: () => void;
};

export function HeroAboveTheFold({
  themeMode,
  onCreateNewGuide,
  onSeeExample,
}: HeroAboveTheFoldProps) {
  return (
    <section className="relative overflow-hidden bg-bg text-text">
      {/* Background image (Prompt 1) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url(${themeMode === "dark" ? backgroundHero : backgroundHeroLight2})` }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-1 md:items-start">
          <div className="md:col-span-6 space-y-6 ">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/75 px-3 py-1 text-sm text-muted shadow-panel backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent shadow-glow" />
              Built for focus in the kitchen
            </div>

            <h1 className="font-display text-4xl md:text-6xl leading-tight">
              Cook one clear step <span className="text-muted">at a time.</span>
            </h1>

            <p className="text-lg md:text-xl text-text max-w-xl rounded-2xl bg-surface/70 px-4 py-3 shadow-panel backdrop-blur">
              Paste any recipe. We turn it into a distraction-friendly cooking guide:
              short steps, ingredient callouts, and timers—so you keep moving.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={onCreateNewGuide}
                className="h-[44px] px-6 rounded-2xl bg-primary text-white font-semibold shadow-panel hover:opacity-90 transition-normal"
              >
                Turn any recipe into a cooking guide
              </button>

              <button
                onClick={onSeeExample}
                className="h-[44px] px-6 rounded-2xl border border-violet/50 bg-violet/70 text-muted shadow-panel backdrop-blur hover:bg-surface-2 transition-normal"
              >
                See an example
              </button>
            </div>

            {/* Trust + reassurance */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted rounded-2xl bg-surface/70 px-4 py-3 font-semibold shadow-panel backdrop-blur">
              <span>✓ Edit anything before you start</span>
              <span>✓ No walls of text in Cook Mode</span>
              <span>✓ Progress + “Where was I?” rescue</span>
            </div>

            <div className="pt-4 grid grid-cols-3 gap-3 max-w-xl">
              {[
                { title: "Paste", desc: "Any recipe text" },
                { title: "Review", desc: "Quick auto-fixes" },
                { title: "Cook", desc: "One step per screen" },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-2xl border border-border bg-surface/70 p-4 shadow-panel backdrop-blur"
                >
                  <div className="font-semibold">{x.title}</div>
                  <div className="text-sm text-muted mt-1">{x.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-6">

            <div className="mt-4 p-4 rounded-2xl text-sm text-muted bg-surface/50 font-semibold">
              Optimized for low-glare kitchen use • big tap targets • thick focus rings
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
