import type { SortKey, SortState } from "../types/record";

/**
 * Query, genre, in-stock, and sort all change together as one logical
 * "filter state" — they're read together on every render of the table,
 * and several UI actions (e.g. a future "reset filters" button) need to
 * touch more than one of them at once. That combination is the textbook
 * signal for useReducer over a handful of separate useState calls: related
 * state, transitions that are easier to name than to spell out inline.
 */
export interface FilterSortState {
  query: string;
  genre: string | "all";
  inStockOnly: boolean;
  sort: SortState;
}

export const initialFilterSortState: FilterSortState = {
  query: "",
  genre: "all",
  inStockOnly: false,
  sort: { key: "artist", direction: "asc" },
};

export type FilterSortAction =
  | { type: "SET_QUERY"; query: string }
  | { type: "SET_GENRE"; genre: string }
  | { type: "TOGGLE_IN_STOCK" }
  | { type: "SET_SORT"; key: SortKey }
  | { type: "RESET" };

export function filterSortReducer(
  state: FilterSortState,
  action: FilterSortAction
): FilterSortState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.query };

    case "SET_GENRE":
      return { ...state, genre: action.genre };

    case "TOGGLE_IN_STOCK":
      return { ...state, inStockOnly: !state.inStockOnly };

    case "SET_SORT": {
      const isSameKey = state.sort.key === action.key;
      return {
        ...state,
        sort: isSameKey
          ? { key: action.key, direction: state.sort.direction === "asc" ? "desc" : "asc" }
          : { key: action.key, direction: "asc" },
      };
    }

    case "RESET":
      return initialFilterSortState;

    default:
      return state;
  }
}
