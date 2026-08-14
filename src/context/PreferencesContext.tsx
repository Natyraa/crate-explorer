import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Density = "comfortable" | "compact";

interface PreferencesValue {
  density: Density;
  toggleDensity: () => void;
  rowHeight: number;
}

const ROW_HEIGHT: Record<Density, number> = {
  comfortable: 44,
  compact: 32,
};

// Not exported — consumers go through usePreferences() so the provider is
// the only thing that knows this context exists. Keeps the "how" (Context)
// separate from the "what" (a preferences API) that the rest of the app sees.
const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [density, setDensity] = useState<Density>("comfortable");

  // Memoized so components consuming only `rowHeight` or only `toggleDensity`
  // don't re-render on renders where neither actually changed.
  const value = useMemo<PreferencesValue>(
    () => ({
      density,
      rowHeight: ROW_HEIGHT[density],
      toggleDensity: () => setDensity((d) => (d === "comfortable" ? "compact" : "comfortable")),
    }),
    [density]
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

/**
 * Throws (rather than silently returning a default) if used outside the
 * provider — a component that reads preferences without a real provider
 * above it is a bug, not a valid state, and should fail loudly in
 * development instead of rendering with fake defaults.
 */
export function usePreferences(): PreferencesValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return ctx;
}
