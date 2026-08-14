import { describe, it, expect } from "vitest";
import { filterRecords, sortRecords, getGenreList, formatPrice } from "../lib/recordUtils";
import type { VinylRecord } from "../types/record";

const sample: VinylRecord[] = [
  { id: "1", catalog: "CR-00001", artist: "Alice Coltrane", title: "Journey in Satchidananda", genre: "Jazz", year: 1971, format: "LP", condition: "Mint", price: 42, stock: 3 },
  { id: "2", catalog: "CR-00002", artist: "Fela Kuti", title: "Zombie", genre: "Afrobeat", year: 1976, format: "LP", condition: "Very Good", price: 28, stock: 0 },
  { id: "3", catalog: "CR-00003", artist: "Can", title: "Tago Mago", genre: "Krautrock", year: 1971, format: "Double LP", condition: "Near Mint", price: 65, stock: 1 },
];

describe("filterRecords", () => {
  it("returns everything when there is no query and no active filters", () => {
    const result = filterRecords(sample, { query: "", genre: "all", inStockOnly: false });
    expect(result).toHaveLength(3);
  });

  it("matches by artist, title, or catalog number, case-insensitively", () => {
    expect(filterRecords(sample, { query: "coltrane", genre: "all", inStockOnly: false })).toHaveLength(1);
    expect(filterRecords(sample, { query: "ZOMBIE", genre: "all", inStockOnly: false })).toHaveLength(1);
    expect(filterRecords(sample, { query: "cr-00003", genre: "all", inStockOnly: false })).toHaveLength(1);
  });

  it("filters by genre", () => {
    const result = filterRecords(sample, { query: "", genre: "Jazz", inStockOnly: false });
    expect(result).toEqual([sample[0]]);
  });

  it("filters out-of-stock records when inStockOnly is true", () => {
    const result = filterRecords(sample, { query: "", genre: "all", inStockOnly: true });
    expect(result.map((r) => r.id)).toEqual(["1", "3"]);
  });

  it("combines query, genre, and stock filters together", () => {
    const result = filterRecords(sample, { query: "tago", genre: "Krautrock", inStockOnly: true });
    expect(result).toEqual([sample[2]]);
  });
});

describe("sortRecords", () => {
  it("sorts numerically by price, ascending", () => {
    const result = sortRecords(sample, { key: "price", direction: "asc" });
    expect(result.map((r) => r.id)).toEqual(["2", "1", "3"]);
  });

  it("sorts numerically by price, descending", () => {
    const result = sortRecords(sample, { key: "price", direction: "desc" });
    expect(result.map((r) => r.id)).toEqual(["3", "1", "2"]);
  });

  it("sorts alphabetically by artist", () => {
    const result = sortRecords(sample, { key: "artist", direction: "asc" });
    expect(result.map((r) => r.id)).toEqual(["1", "3", "2"]);
  });

  it("does not mutate the input array", () => {
    const original = [...sample];
    sortRecords(sample, { key: "year", direction: "desc" });
    expect(sample).toEqual(original);
  });
});

describe("getGenreList", () => {
  it("returns a sorted, de-duplicated list of genres", () => {
    const withDupes = [...sample, { ...sample[0], id: "4", genre: "Jazz" }];
    expect(getGenreList(withDupes)).toEqual(["Afrobeat", "Jazz", "Krautrock"]);
  });
});

describe("formatPrice", () => {
  it("formats a number as a two-decimal dollar string", () => {
    expect(formatPrice(9)).toBe("$9.00");
    expect(formatPrice(19.5)).toBe("$19.50");
    expect(formatPrice(100.999)).toBe("$101.00");
  });
});
