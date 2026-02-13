import backgroundFooterDark from "../assets/colorful-food-cutting-board.jpeg";
import backgroundFooterLight from "../assets/rustic-table-background.png";
import backgroundHeroLight2 from "../assets/colorful-food-cutting-board.jpeg";
import backgroundHeroLight3 from "../assets/congerdesign-chunks-594496_1920.jpg";
import backgroundHeroLight4 from "../assets/congerdesign-mushrooms-756406_1920.jpg";
import backgroundHeroLight5 from "../assets/congerdesign-waffles-2190961_1920.jpg";
import backgroundHeroLight6 from "../assets/daria-yakovleva-cooking-2132874_1920.jpg";

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
