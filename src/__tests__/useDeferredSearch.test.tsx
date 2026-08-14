import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDeferredSearch } from "../hooks/useDeferredSearch";

describe("useDeferredSearch", () => {
  it("returns the initial value immediately with isStale false", () => {
    const { result } = renderHook(() => useDeferredSearch("coltrane"));
    expect(result.current.deferredQuery).toBe("coltrane");
    expect(result.current.isStale).toBe(false);
  });

  it("eventually catches up to rapid updates and settles with isStale false", () => {
    const { result, rerender } = renderHook(({ query }) => useDeferredSearch(query), {
      initialProps: { query: "a" },
    });

    rerender({ query: "ab" });
    rerender({ query: "abc" });

    // React flushes the deferred value once no more urgent updates are
    // pending; by the time the test can observe it, it has settled.
    expect(result.current.deferredQuery).toBe("abc");
    expect(result.current.isStale).toBe(false);
  });
});
