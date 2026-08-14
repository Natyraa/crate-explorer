export interface VinylRecord {
  id: string;
  catalog: string;
  artist: string;
  title: string;
  genre: string;
  year: number;
  format: string;
  condition: string;
  price: number;
  stock: number;
}

export type SortKey = keyof Pick<
  VinylRecord,
  "artist" | "title" | "genre" | "year" | "price" | "stock"
>;

export type SortDirection = "asc" | "desc";

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}

export interface FilterState {
  query: string;
  genre: string | "all";
  inStockOnly: boolean;
}
