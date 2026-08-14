import { useEffect, useState } from "react";
import type { VinylRecord } from "../types/record";

interface UseRecordsResult {
  records: VinylRecord[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Loads the mock catalog once on mount. In a real app this would hit
 * an API; here it's a static JSON file so the project can run and be
 * reviewed with zero backend, while the loading/error states still
 * mirror what a real fetch would need to handle.
 */
export function useRecords(): UseRecordsResult {
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${import.meta.env.BASE_URL}records.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load catalog (${res.status})`);
        return res.json();
      })
      .then((data: VinylRecord[]) => {
        if (!cancelled) {
          setRecords(data);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { records, isLoading, error };
}
