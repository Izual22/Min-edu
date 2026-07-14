"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Item } from "@/types";
  interface RowProps {
        label: string;
        value?: string;
        isLink?: boolean;
    }
export default function ItemDetail() {
  const { id } = useParams();
  const [entry, setEntry] = useState<Item  | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setEntry)
      .catch(() => setError("Couldn't load this item."))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-16 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-black dark:hover:text-zinc-50"
          >
            ← Back to items
          </Link>
          {entry && (
            <Link
              href={`/items/${id}/edit`}
              className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-black"
            >
              Edit
            </Link>
          )}
        </div>

        {isLoading && <p className="text-sm text-zinc-500">Loading…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {entry && (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h1 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50">
              {entry.name}
            </h1>
            <dl className="space-y-3 text-sm">
              <Row label="NIP" value={entry.nip} />
              <Row label="Link" value={entry.link} isLink />
              <Row label="Status" value={entry.status} />
              <Row label="Version" value={entry.version} />
              <Row label="BUR link" value={entry.BURLink} isLink />
              <Row label="Page link" value={entry.PageLink} isLink />
              <Row label="Login" value={entry.login} />
              <Row label="Payment info" value={entry.paymentInfo} />
              <Row label="Packet info" value={entry.packetInfo} />
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, isLink = false }: RowProps) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-zinc-100 pb-3 dark:border-zinc-800">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        {label}
      </dt>
      <dd className="text-zinc-800 dark:text-zinc-200">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
