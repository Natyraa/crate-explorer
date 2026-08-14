import { memo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { VinylRecord, SortState, SortKey } from "../types/record";
import { formatPrice } from "../lib/recordUtils";
import { usePreferences } from "../context/PreferencesContext";

const GRID_TEMPLATE =
  "110px minmax(140px,1.4fr) minmax(160px,1.8fr) 110px 70px 100px 120px 90px 80px";

const COLUMNS: { key: SortKey | "catalog" | "format" | "condition"; label: string; sortable: boolean }[] = [
  { key: "catalog", label: "Catalog #", sortable: false },
  { key: "artist", label: "Artist", sortable: true },
  { key: "title", label: "Title", sortable: true },
  { key: "genre", label: "Genre", sortable: true },
  { key: "year", label: "Year", sortable: true },
  { key: "format", label: "Format", sortable: false },
  { key: "condition", label: "Condition", sortable: false },
  { key: "price", label: "Price", sortable: true },
  { key: "stock", label: "Stock", sortable: true },
];

interface CrateTableProps {
  records: VinylRecord[];
  sort: SortState;
  onSortChange: (key: SortKey) => void;
  /** True while a filter/sort change is being applied via useTransition in App. */
  isPending: boolean;
}

export function CrateTable({ records, sort, onSortChange, isPending }: CrateTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { rowHeight } = usePreferences();

  const virtualizer = useVirtualizer({
    count: records.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const renderedCount = virtualItems.length;

  return (
    <div className="border border-hairline rounded-lg overflow-hidden bg-ink-raised/40">
      <p className="sm:hidden px-3 py-1.5 text-[11px] font-mono text-parchment-faint border-b border-hairline bg-ink-raised">
        ← swipe to see more columns →
      </p>
      <div className="overflow-x-auto scrollbar-crate">
        <div style={{ minWidth: 960 }}>
          {/* Header row */}
          <div
            role="row"
            className="grid border-b border-hairline bg-ink-raised text-xs uppercase
                       tracking-wide text-parchment-dim font-body select-none"
            style={{ gridTemplateColumns: GRID_TEMPLATE }}
          >
            {COLUMNS.map((col) => (
              <button
                key={col.key}
                type="button"
                disabled={!col.sortable}
                onClick={() => col.sortable && onSortChange(col.key as SortKey)}
                className={`flex items-center gap-1 px-3 py-2.5 text-left
                  ${col.sortable ? "hover:text-parchment cursor-pointer" : "cursor-default"}
                  ${sort.key === col.key ? "text-amber-bright" : ""}`}
              >
                {col.label}
                {sort.key === col.key && (
                  <span aria-hidden="true" className="font-mono text-[10px]">
                    {sort.direction === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Virtualized body — dimmed slightly while a transition is pending,
              so a genre/sort change never feels frozen even on a big re-filter. */}
          <div
            ref={scrollRef}
            className={`scrollbar-crate overflow-y-auto transition-opacity duration-150 ${
              isPending ? "opacity-50" : "opacity-100"
            }`}
            style={{ height: "560px" }}
          >
            {records.length === 0 ? (
              <EmptyState />
            ) : (
              <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
                {virtualItems.map((virtualRow) => {
                  const record = records[virtualRow.index];
                  return (
                    <Row
                      key={record.id}
                      record={record}
                      top={virtualRow.start}
                      height={rowHeight}
                      isOdd={virtualRow.index % 2 === 1}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Status bar — makes virtualization visible instead of invisible */}
          <div
            className="flex items-center justify-between px-3 py-2 border-t border-hairline
                       bg-ink-raised text-[11px] font-mono text-parchment-faint gap-4"
          >
            <span>
              {isPending
                ? "updating…"
                : `${renderedCount} of ${records.length.toLocaleString()} rows mounted in the DOM`}
            </span>
            <span className="whitespace-nowrap">scroll to page through the crate</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RowProps {
  record: VinylRecord;
  top: number;
  height: number;
  isOdd: boolean;
}

const Row = memo(function Row({ record, top, height, isOdd }: RowProps) {
  const lowStock = record.stock > 0 && record.stock <= 2;
  const outOfStock = record.stock === 0;

  return (
    <div
      role="row"
      className={`absolute left-0 right-0 grid items-center px-0 border-b border-hairline/60
                  hover:bg-ink-hover transition-colors ${isOdd ? "bg-ink/40" : ""}`}
      style={{ transform: `translateY(${top}px)`, height, gridTemplateColumns: GRID_TEMPLATE }}
    >
      <span className="px-3 font-mono text-xs text-parchment-faint truncate">{record.catalog}</span>
      <span className="px-3 text-sm text-parchment truncate">{record.artist}</span>
      <span className="px-3 text-sm text-parchment-dim truncate">{record.title}</span>
      <span className="px-3 text-xs text-parchment-dim truncate">{record.genre}</span>
      <span className="px-3 font-mono text-xs text-parchment-dim">{record.year}</span>
      <span className="px-3 text-xs text-parchment-dim truncate">{record.format}</span>
      <span className="px-3 text-xs text-parchment-dim truncate">{record.condition}</span>
      <span className="px-3 font-mono text-xs text-parchment">{formatPrice(record.price)}</span>
      <span
        className={`px-3 font-mono text-xs ${
          outOfStock ? "text-rust" : lowStock ? "text-amber-bright" : "text-teal"
        }`}
      >
        {outOfStock ? "—" : record.stock}
      </span>
    </div>
  );
});

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-6">
      <p className="font-display text-lg text-parchment">Nothing in this crate.</p>
      <p className="text-sm text-parchment-faint max-w-xs">
        Try a different search term, or clear the genre and stock filters.
      </p>
    </div>
  );
}
