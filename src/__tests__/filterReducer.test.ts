import { describe, it, expect } from "vitest";
import {
  filterSortReducer,
  initialFilterSortState,
  type FilterSortState,
} from "../state/filterReducer";

describe("filterSortReducer", () => {
  it("updates the query on SET_QUERY without touching other fields", () => {
    const next = filterSortReducer(initialFilterSortState, {
      type: "SET_QUERY",
      query: "coltrane",
    });
    expect(next.query).toBe("coltrane");
    expect(next.genre).toBe("all");
    expect(next.sort).toEqual(initialFilterSortState.sort);
  });

  it("updates the genre on SET_GENRE", () => {
    const next = filterSortReducer(initialFilterSortState, {
      type: "SET_GENRE",
      genre: "Dub",
    });
    expect(next.genre).toBe("Dub");
  });

  it("toggles inStockOnly on TOGGLE_IN_STOCK", () => {
    const once = filterSortReducer(initialFilterSortState, { type: "TOGGLE_IN_STOCK" });
    expect(once.inStockOnly).toBe(true);

    const twice = filterSortReducer(once, { type: "TOGGLE_IN_STOCK" });
    expect(twice.inStockOnly).toBe(false);
  });

  describe("SET_SORT", () => {
    it("sorts ascending by a new key", () => {
      const next = filterSortReducer(initialFilterSortState, { type: "SET_SORT", key: "price" });
      expect(next.sort).toEqual({ key: "price", direction: "asc" });
    });

    it("flips direction when the same key is clicked again", () => {
      const first = filterSortReducer(initialFilterSortState, { type: "SET_SORT", key: "price" });
      const second = filterSortReducer(first, { type: "SET_SORT", key: "price" });
      expect(second.sort).toEqual({ key: "price", direction: "desc" });
    });

    it("resets to ascending when switching to a different key", () => {
      const priceDesc: FilterSortState = {
        ...initialFilterSortState,
        sort: { key: "price", direction: "desc" },
      };
      const next = filterSortReducer(priceDesc, { type: "SET_SORT", key: "year" });
      expect(next.sort).toEqual({ key: "year", direction: "asc" });
    });
  });

  it("returns the full initial state on RESET, discarding all changes", () => {
    const changed = filterSortReducer(initialFilterSortState, { type: "SET_QUERY", query: "x" });
    const withGenre = filterSortReducer(changed, { type: "SET_GENRE", genre: "Jazz" });
    const reset = filterSortReducer(withGenre, { type: "RESET" });
    expect(reset).toEqual(initialFilterSortState);
  });

  it("never mutates the state object passed in", () => {
    const before = { ...initialFilterSortState };
    filterSortReducer(initialFilterSortState, { type: "SET_QUERY", query: "y" });
    expect(initialFilterSortState).toEqual(before);
  });
});
