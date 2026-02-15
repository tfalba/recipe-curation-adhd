import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type LineSpacing = "normal" | "roomy";
type ColorIntensity = "standard" | "extra-contrast";
type ThemeMode = "dark" | "light";

type SettingsContextValue = {
  focusMode: boolean;
  reduceMotion: boolean;
  largeText: boolean;
  lineSpacing: LineSpacing;
  soundOn: boolean;
  colorIntensity: ColorIntensity;
  themeMode: ThemeMode;
  keepScreenAwake: boolean;
  toggleFocus: () => void;
  toggleReduceMotion: () => void;
  toggleLargeText: () => void;
  toggleSound: () => void;
  toggleTheme: () => void;
  toggleKeepScreenAwake: () => void;
  setLineSpacing: (value: LineSpacing) => void;
  setColorIntensity: (value: ColorIntensity) => void;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "dark";
  }
  const stored = window.localStorage.getItem("recipe-theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark").matches ? "dark" : "light";
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [focusMode, setFocusMode] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [lineSpacing, setLineSpacing] = useState<LineSpacing>("roomy");
  const [soundOn, setSoundOn] = useState(true);
  const [colorIntensity, setColorIntensity] =
    useState<ColorIntensity>("extra-contrast");
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const [keepScreenAwake, setKeepScreenAwake] = useState(false);
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || typeof document === "undefined") {
      return;
    }

    const requestWakeLock = async () => {
      if (!keepScreenAwake) {
        return;
      }
      if (!("wakeLock" in navigator)) {
        return;
      }
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        wakeLockRef.current?.addEventListener?.("release", () => {
          wakeLockRef.current = null;
        });
      } catch {
        wakeLockRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void requestWakeLock();
      }
    };

    if (keepScreenAwake) {
      void requestWakeLock();
      document.addEventListener("visibilitychange", handleVisibilityChange);
    } else {
      wakeLockRef.current?.release?.();
      wakeLockRef.current = null;
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLockRef.current?.release?.();
      wakeLockRef.current = null;
    };
  }, [keepScreenAwake]);

  useEffect(() => {
    window.localStorage.setItem("recipe-theme", themeMode);
  }, [themeMode]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      focusMode,
      reduceMotion,
      largeText,
      lineSpacing,
      soundOn,
      colorIntensity,
      themeMode,
      keepScreenAwake,
      toggleFocus: () => setFocusMode((value) => !value),
      toggleReduceMotion: () => setReduceMotion((value) => !value),
      toggleLargeText: () => setLargeText((value) => !value),
      toggleSound: () => setSoundOn((value) => !value),
      toggleTheme: () =>
        setThemeMode((value) => (value === "dark" ? "light" : "dark")),
      toggleKeepScreenAwake: () => setKeepScreenAwake((value) => !value),
      setLineSpacing,
      setColorIntensity,
      resetSettings: () => {
        setFocusMode(false);
        setReduceMotion(false);
        setLargeText(false);
        setLineSpacing("roomy");
        setSoundOn(true);
        setColorIntensity("extra-contrast");
        setThemeMode(getInitialTheme());
        setKeepScreenAwake(false);
      },
    }),
    [
      focusMode,
      reduceMotion,
      largeText,
      lineSpacing,
      soundOn,
      colorIntensity,
      themeMode,
      keepScreenAwake,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider.");
  }
  return context;
}
