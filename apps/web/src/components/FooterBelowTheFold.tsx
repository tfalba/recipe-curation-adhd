import backgroundFooterDark from "../assets/colorful-food-cutting-board.jpeg";
import backgroundFooterLight from "../assets/rustic-table-background.png";

type HeroAboveTheFoldProps = {
  themeMode: "dark" | "light";
};

export function FooterBelowTheFold({
  themeMode,
}: HeroAboveTheFoldProps) {
  return (
    <section className="min-h-[max(300px,30vh)] relative overflow-hidden bg-bg text-text">
      {/* Background image (Prompt 1) */}
      <div
        className="relative h-[max(300px,30vh)] bg-cover opacity-80 bg-y-[70%]"
        style={{ backgroundImage: `url(${themeMode === "dark" ? backgroundFooterDark : backgroundFooterLight})` }}
        aria-hidden="true"
      />

    </section>
  );
}
