import type { ViewKey } from "./types";

type BottomNavProps = {
  activeView: ViewKey;
  onChange: (view: ViewKey) => void;
};

export default function BottomNav({ activeView, onChange }: BottomNavProps) {
  const items: { key: ViewKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "review", label: "Review" },
    { key: "cook", label: "Cook" },
    { key: "library", label: "Library" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-border bg-surface/90 px-4 py-3 text-xs text-muted backdrop-blur">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`min-h-[44px] px-2 ${
            activeView === item.key ? "text-accent" : "text-muted"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
