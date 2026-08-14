import { useDeferredValue, useMemo } from "react";

/**
 * An alternative to useDebounce, built on React's own useDeferredValue
 * instead of a hand-rolled timer. Not wired into App.tsx — kept here, fully
 * tested, as a reference implementation and a talking point on the
 * trade-off between the two approaches. See README.md → "Debounce vs.
 * useDeferredValue vs. useTransition" for the full comparison.
 *
 * The key behavioral difference from useDebounce: there's no fixed delay.
 * React defers re-rendering the expensive consumer of this value only for
 * as long as something more urgent (like the keystroke itself) needs the
 * main thread — it can settle in 10ms or 300ms depending on actual load,
 * rather than always waiting a hardcoded 200ms even when the device is
 * idle and could have kept up instantly.
 */
export function useDeferredSearch(query: string) {
  const deferredQuery = useDeferredValue(query);

  // isStale tells the UI "the value on screen is behind what's been typed" —
  // the same role isPending plays for useTransition, useful for a subtle
  // loading indicator without blocking the input itself.
  const isStale = useMemo(() => query !== deferredQuery, [query, deferredQuery]);

  return { deferredQuery, isStale };
}
