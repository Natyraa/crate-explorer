import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { PreferencesProvider, usePreferences } from "../context/PreferencesContext";
import type { ReactNode } from "react";

function wrapper({ children }: { children: ReactNode }) {
  return <PreferencesProvider>{children}</PreferencesProvider>;
}

describe("usePreferences", () => {
  it("throws when used outside a PreferencesProvider", () => {
    // Silence the expected React error log for this one assertion.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => usePreferences())).toThrow(
      "usePreferences must be used within a PreferencesProvider"
    );
    spy.mockRestore();
  });

  it("defaults to comfortable density with a 44px row height", () => {
    const { result } = renderHook(() => usePreferences(), { wrapper });
    expect(result.current.density).toBe("comfortable");
    expect(result.current.rowHeight).toBe(44);
  });

  it("toggles between comfortable and compact", () => {
    const { result } = renderHook(() => usePreferences(), { wrapper });

    act(() => result.current.toggleDensity());
    expect(result.current.density).toBe("compact");
    expect(result.current.rowHeight).toBe(32);

    act(() => result.current.toggleDensity());
    expect(result.current.density).toBe("comfortable");
    expect(result.current.rowHeight).toBe(44);
  });
});
