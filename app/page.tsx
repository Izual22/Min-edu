"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Item } from "@/types";
import { Trash, Eye, Pen, Search } from "lucide-react";

// Recharts measures the DOM after mount, so its output can't match the server-rendered
// HTML — disabling SSR for this component avoids the hydration mismatch entirely.
const StatusPieChart = dynamic(() => import("./components/Piechart"), { ssr: false });

export default function Home() {
  const [entries, setEntries] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/items")
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => setError("Couldn't load the list. Try refreshing."))
      .finally(() => setIsLoading(false));
  }, []);

  // Unique, non-empty statuses actually present in the data, for the dropdown options
  const statusOptions = useMemo(() => {
    const unique = new Set(entries.map((e) => e.status).filter(Boolean) as string[]);
    return Array.from(unique).sort();
  }, [entries]);

  // Count of entries per status, for the pie chart — based on all entries, not the filtered view
  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      const key = entry.status?.trim() || "Brak statusu";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesQuery =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        entry.nip.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [entries, query, statusFilter]);

  async function handleDelete(id: string) {
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-16 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Obiekty
          </h1>
          <Link
            href="/items/new"
            className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-[#383838] dark:bg-white dark:text-black dark:hover:bg-[#ccc]"
          >
            Dodaj obiekty
          </Link>
        </div>

        {!isLoading && statusCounts.length > 0 && (
          <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Rozkład statusów
            </h2>
            <StatusPieChart data={statusCounts} />
          </div>
        )}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj po nazwie lub NIP..."
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="all">Wszystkie statusy</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <p className="text-sm text-zinc-500">Loading…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="space-y-3">
          {!isLoading && entries.length === 0 && (
            <p className="text-sm text-zinc-400">No items yet.</p>
          )}
          {!isLoading && entries.length > 0 && filteredEntries.length === 0 && (
            <p className="text-sm text-zinc-400">No items match your filters.</p>
          )}

          {filteredEntries.length > 0 && (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-left dark:border-zinc-800 dark:bg-zinc-900">
                  <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">Nazwa Firmy</th>
                  <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">Status</th>
                  <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">NIP</th>
                  <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">Wersja</th>
                  <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-zinc-100 bg-white last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                  >
                    <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                      {entry.name}
                    </td>
                    <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                      {entry.status}
                    </td>
                    <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                      {entry.nip}
                    </td>
                    <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                      v{entry.version}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/items/${entry.id}`}
                          className="text-zinc-400 hover:text-black dark:hover:text-zinc-50"
                          aria-label={`Sprawdź ${entry.name}`}
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/items/${entry.id}/edit`}
                          className="text-zinc-400 hover:text-black dark:hover:text-zinc-50"
                          aria-label={`Edytuj ${entry.name}`}
                        >
                          <Pen size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-zinc-400 hover:text-red-500"
                          aria-label={`Usuń ${entry.name}`}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}