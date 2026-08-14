import { useMemo, useReducer, useTransition } from "react";
import { useRecords } from "./hooks/useRecords";
import { useDebounce } from "./hooks/useDebounce";
import { filterRecords, sortRecords, getGenreList } from "./lib/recordUtils";
import { filterSortReducer, initialFilterSortState } from "./state/filterReducer";
import { usePreferences } from "./context/PreferencesContext";
import { SearchBar } from "./components/SearchBar";
import { FilterBar } from "./components/FilterBar";
import { CrateTable } from "./components/CrateTable";

export default function App() {
  const { records, isLoading, error } = useRecords();
  const { density, toggleDensity } = usePreferences();

  // One reducer instead of four separate useState calls — query, genre,
  // inStockOnly, and sort all change together as a single "filter state"
  // and share a RESET action. See src/state/filterReducer.ts for the
  // reasoning on why this earns useReducer over useState.
  const [filters, dispatch] = useReducer(filterSortReducer, initialFilterSortState);

  const debouncedQuery = useDebounce(filters.query, 200);

  // Genre changes, the in-stock toggle, and sort clicks are discrete,
  // already-batched user actions (not a stream of keystrokes like search),
  // so they're a good fit for useTransition instead of a fixed debounce:
  // React marks the resulting re-filter/re-sort of up to 12,000 rows as
  // low-priority and keeps the UI (e.g. the button's own hover/press state)
  // responsive while it happens. isPending drives a small inline indicator
  // in CrateTable rather than blocking the interaction.
  const [isPending, startTransition] = useTransition();

  const genres = useMemo(() => getGenreList(records), [records]);

  const visibleRecords = useMemo(() => {
    const filtered = filterRecords(records, {
      query: debouncedQuery,
      genre: filters.genre,
      inStockOnly: filters.inStockOnly,
    });
    return sortRecords(filtered, filters.sort);
  }, [records, debouncedQuery, filters.genre, filters.inStockOnly, filters.sort]);

  return (
    <div className="min-h-screen bg-ink text-parchment font-body px-4 py-10 sm:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">
            Crate Explorer
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-parchment">
            {records.length.toLocaleString() || "…"} records, rendered a window at a time
          </h1>
          <p className="text-sm text-parchment-dim max-w-2xl">
            A virtualized catalog table built to stay smooth at 12,000 rows — only the
            rows visible in the scroll viewport ever touch the DOM. Search, sort, and
            filter run against the full dataset in memory.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={filters.query}
            onChange={(query) => dispatch({ type: "SET_QUERY", query })}
            resultCount={visibleRecords.length}
            totalCount={records.length}
          />
          <FilterBar
            genres={genres}
            selectedGenre={filters.genre}
            onGenreChange={(genre) => startTransition(() => dispatch({ type: "SET_GENRE", genre }))}
            inStockOnly={filters.inStockOnly}
            onInStockChange={() => startTransition(() => dispatch({ type: "TOGGLE_IN_STOCK" }))}
            density={density}
            onToggleDensity={toggleDensity}
          />
        </div>

        {error ? (
          <div className="border border-rust/40 bg-rust/10 rounded-lg px-4 py-3 text-sm text-rust">
            Couldn't load the catalog: {error}
          </div>
        ) : isLoading ? (
          <LoadingState />
        ) : (
          <CrateTable
            records={visibleRecords}
            sort={filters.sort}
            onSortChange={(key) => startTransition(() => dispatch({ type: "SET_SORT", key }))}
            isPending={isPending}
          />
        )}

        <footer className="text-xs text-parchment-faint font-mono pt-4">
          Built with React, TypeScript, and @tanstack/react-virtual.
        </footer>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="border border-hairline rounded-lg bg-ink-raised/40 h-[608px] flex items-center justify-center">
      <div className="flex items-center gap-3 text-parchment-dim text-sm">
        <span
          aria-hidden="true"
          className="inline-block h-3 w-3 rounded-full border-2 border-amber border-t-transparent animate-spin"
        />
        Loading the crate…
      </div>
    </div>
  );
}
