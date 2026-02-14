import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ViewKey } from "../components";

type ViewContextValue = {
  activeView: ViewKey;
  setActiveView: (view: ViewKey) => void;
  goOverview: () => void;
  goReview: () => void;
  goCook: () => void;
  goLibrary: () => void;
  goSettings: () => void;
};

const ViewContext = createContext<ViewContextValue | null>(null);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ViewKey>("overview");

  const value = useMemo<ViewContextValue>(
    () => ({
      activeView,
      setActiveView,
      goOverview: () => setActiveView("overview"),
      goReview: () => setActiveView("review"),
      goCook: () => setActiveView("cook"),
      goLibrary: () => setActiveView("library"),
      goSettings: () => setActiveView("settings"),
    }),
    [activeView]
  );

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

export function useView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView must be used within ViewProvider.");
  }
  return context;
}
