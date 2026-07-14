"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Item } from "@/types";

export default function Home() {
  const [entries, setEntries] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/items")
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => setError("Couldn't load the list. Try refreshing."))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(id: string) {
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-16 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Items
          </h1>
          <Link
            href="/items/new"
            className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-[#383838] dark:bg-white dark:text-black dark:hover:bg-[#ccc]"
          >
            Add item
          </Link>
        </div>

        {isLoading && <p className="text-sm text-zinc-500">Loading…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="space-y-3">
          {!isLoading && entries.length === 0 && (
            <p className="text-sm text-zinc-400">No items yet.</p>
          )}

          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <Link href={`/items/${entry.id}`} className="flex-1 hover:opacity-70">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-black dark:text-zinc-50">
                    {entry.name}
                  </h3>
                  {entry.status && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {entry.status}
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  NIP: {entry.nip}
                  {entry.version ? ` · v${entry.version}` : ""}
                </p>
              </Link>
              <div className="ml-4 flex gap-3">
                <Link
                  href={`/items/${entry.id}/edit`}
                  className="text-sm text-zinc-400 hover:text-black dark:hover:text-zinc-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-sm text-zinc-400 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
