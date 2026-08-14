interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

export function SearchBar({ value, onChange, resultCount, totalCount }: SearchBarProps) {
  return (
    <div className="flex-1 min-w-[240px]">
      <div className="relative">
        <label htmlFor="crate-search" className="sr-only">
          Search by artist, title, or catalog number
        </label>
        <input
          id="crate-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search artist, title, catalog #…"
          className="w-full bg-ink-raised border border-hairline rounded-md pl-4 pr-4 sm:pr-24 py-2.5
                     text-parchment placeholder:text-parchment-faint font-body text-sm
                     focus:border-amber transition-colors"
        />
        <span className="hidden sm:inline pointer-events-none absolute right-3 top-1/2 -translate-y-1/2
                          text-xs font-mono text-parchment-faint">
          {resultCount.toLocaleString()} / {totalCount.toLocaleString()}
        </span>
      </div>
      <p className="sm:hidden mt-1.5 px-0.5 text-xs font-mono text-parchment-faint">
        {resultCount.toLocaleString()} / {totalCount.toLocaleString()} records
      </p>
    </div>
  );
}
