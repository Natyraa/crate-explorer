import type { VinylRecord, SortState, FilterState } from "../types/record";

/**
 * Pure filter function — no React, no side effects.
 * Kept separate from components so it's trivial to unit test
 * and so the table component only has to call it inside useMemo.
 */
export function filterRecords(
  records: VinylRecord[],
  filters: FilterState
): VinylRecord[] {
  const query = filters.query.trim().toLowerCase();

  return records.filter((record) => {
    if (filters.inStockOnly && record.stock <= 0) return false;
    if (filters.genre !== "all" && record.genre !== filters.genre) return false;

    if (query.length === 0) return true;

    return (
      record.artist.toLowerCase().includes(query) ||
      record.title.toLowerCase().includes(query) ||
      record.catalog.toLowerCase().includes(query)
    );
  });
}

/**
 * Pure sort function. Returns a *new* array (never mutates input) —
 * important because the input often comes straight from useMemo output
 * that other parts of the tree may still be reading from.
 */
export function sortRecords(
  records: VinylRecord[],
  sort: SortState
): VinylRecord[] {
  const sorted = [...records].sort((a, b) => {
    const aVal = a[sort.key];
    const bVal = b[sort.key];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return aVal - bVal;
    }

    return String(aVal).localeCompare(String(bVal));
  });

  return sort.direction === "asc" ? sorted : sorted.reverse();
}

export function getGenreList(records: VinylRecord[]): string[] {
  return Array.from(new Set(records.map((r) => r.genre))).sort();
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
