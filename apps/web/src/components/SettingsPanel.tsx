import { useSettings } from "../settings/SettingsContext";

type SettingRowProps = {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
};

export default function SettingsPanel() {
  const {
    focusMode,
    reduceMotion,
    largeText,
    lineSpacing,
    soundOn,
    colorIntensity,
    themeMode,
    toggleFocus,
    toggleReduceMotion,
    toggleLargeText,
    toggleSound,
    toggleTheme,
    setLineSpacing,
    setColorIntensity,
  } = useSettings();
  return (
    <section className="rounded-3xl border border-border bg-surface p-5 shadow-panel">
      <h4 className="text-lg font-display font-semibold">
        Settings + Accessibility
      </h4>
      <div className="mt-4 space-y-6">
        <SettingRow
          label="Focus Mode default"
          value={focusMode ? "On" : "Off"}
          onClick={toggleFocus}
          active={focusMode}
        />
        <SettingRow
          label="Reduce motion"
          value={reduceMotion ? "On" : "Off"}
          onClick={toggleReduceMotion}
          active={reduceMotion}
        />
        <SettingRow
          label="Large text"
          value={largeText ? "On" : "Off"}
          onClick={toggleLargeText}
          active={largeText}
        />
        <SettingRow
          label="Sound on timer"
          value={soundOn ? "On" : "Off"}
          onClick={toggleSound}
          active={soundOn}
        />
        <SettingRow
          label="Theme"
          value={themeMode === "dark" ? "Dark" : "Light"}
          onClick={toggleTheme}
          active={themeMode === "light"}
        />
        <SettingRow
          label="Line spacing"
          value={lineSpacing === "roomy" ? "Roomy" : "Normal"}
          onClick={() =>
            setLineSpacing(lineSpacing === "roomy" ? "normal" : "roomy")
          }
          active={lineSpacing === "roomy"}
        />
        <SettingRow
          label="Color intensity"
          value={colorIntensity === "extra-contrast" ? "Extra" : "Standard"}
          onClick={() =>
            setColorIntensity(
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
      className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm shadow-panel transition duration-quick ease-snappy hover:translate-y-[-2px] hover:shadow-glow ${
        active ? "bg-violet/60 border border-violet/40 text-text" : "border border-violet/40 text-muted"

      }`}
    >
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </button>
  );
}
