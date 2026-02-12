type SettingsPanelProps = {
  focusMode: boolean;
  reduceMotion: boolean;
  largeText: boolean;
  lineSpacing: "normal" | "roomy";
  soundOn: boolean;
  colorIntensity: "standard" | "extra-contrast";
  themeMode: "dark" | "light";
  onToggleFocus: () => void;
  onToggleReduceMotion: () => void;
  onToggleLargeText: () => void;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onChangeLineSpacing: (value: "normal" | "roomy") => void;
  onChangeColorIntensity: (value: "standard" | "extra-contrast") => void;
};

type SettingRowProps = {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
};

export default function SettingsPanel({
  focusMode,
  reduceMotion,
  largeText,
  lineSpacing,
  soundOn,
  colorIntensity,
  themeMode,
  onToggleFocus,
  onToggleReduceMotion,
  onToggleLargeText,
  onToggleSound,
  onToggleTheme,
  onChangeLineSpacing,
  onChangeColorIntensity,
}: SettingsPanelProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-5 shadow-panel">
      <h4 className="text-lg font-display font-semibold">
        Settings + Accessibility
      </h4>
      <div className="mt-4 space-y-3">
        <SettingRow
          label="Focus Mode default"
          value={focusMode ? "On" : "Off"}
          onClick={onToggleFocus}
          active={focusMode}
        />
        <SettingRow
          label="Reduce motion"
          value={reduceMotion ? "On" : "Off"}
          onClick={onToggleReduceMotion}
          active={reduceMotion}
        />
        <SettingRow
          label="Large text"
          value={largeText ? "On" : "Off"}
          onClick={onToggleLargeText}
          active={largeText}
        />
        <SettingRow
          label="Sound on timer"
          value={soundOn ? "On" : "Off"}
          onClick={onToggleSound}
          active={soundOn}
        />
        <SettingRow
          label="Theme"
          value={themeMode === "dark" ? "Dark" : "Light"}
          onClick={onToggleTheme}
          active={themeMode === "light"}
        />
        <SettingRow
          label="Line spacing"
          value={lineSpacing === "roomy" ? "Roomy" : "Normal"}
          onClick={() =>
            onChangeLineSpacing(lineSpacing === "roomy" ? "normal" : "roomy")
          }
          active={lineSpacing === "roomy"}
        />
        <SettingRow
          label="Color intensity"
          value={colorIntensity === "extra-contrast" ? "Extra" : "Standard"}
          onClick={() =>
            onChangeColorIntensity(
              colorIntensity === "extra-contrast"
                ? "standard"
                : "extra-contrast"
            )
          }
          active={colorIntensity === "extra-contrast"}
        />
      </div>
    </section>
  );
}

function SettingRow({ label, value, active, onClick }: SettingRowProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border border-border px-3 py-3 text-sm ${
        active ? "bg-accent/20 text-muted" : "bg-surface-2 text-muted"
      }`}
    >
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </button>
  );
}
