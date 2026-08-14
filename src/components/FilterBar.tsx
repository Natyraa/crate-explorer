import type { Density } from "../context/PreferencesContext";

interface FilterBarProps {
  genres: string[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  inStockOnly: boolean;
  onInStockChange: () => void;
  density: Density;
  onToggleDensity: () => void;
}

export function FilterBar({
  genres,
  selectedGenre,
  onGenreChange,
  inStockOnly,
  onInStockChange,
  density,
  onToggleDensity,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <label className="sr-only" htmlFor="genre-filter">
        Filter by genre
      </label>
      <select
        id="genre-filter"
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        className="bg-ink-raised border border-hairline rounded-md px-3 py-2.5
                   text-sm text-parchment font-body focus:border-amber transition-colors
                   cursor-pointer"
      >
        <option value="all">All genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onInStockChange}
        aria-pressed={inStockOnly}
        className={`px-3 py-2.5 rounded-md text-sm font-body border transition-colors
          ${
            inStockOnly
              ? "bg-amber/15 border-amber text-amber-bright"
              : "bg-ink-raised border-hairline text-parchment-dim hover:text-parchment"
          }`}
      >
        In stock only
      </button>

      <button
        type="button"
        onClick={onToggleDensity}
        aria-pressed={density === "compact"}
        title="Toggle row density"
        className="px-3 py-2.5 rounded-md text-sm font-body border transition-colors
                   bg-ink-raised border-hairline text-parchment-dim hover:text-parchment"
      >
        {density === "compact" ? "Compact" : "Comfortable"} rows
      </button>
    </div>
  );
}
