"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Item } from "@/types";
import { Eye, EyeOff } from "lucide-react";
  interface RowProps {
        label: string;
        value?: string;
        isLink?: boolean;
        asPill?: boolean
        isPassword?: boolean;
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
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-black dark:hover:text-zinc-50"
          >
            ← Powrót do listy
          </Link>
          {entry && (
            <div className="mt-4 flex items-center justify-between">
                <div>
                    <div className="flex flex-row items-center gap-2">
                        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
                            {entry.name}
                        </h1>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                            {entry.status}
                        </span>
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-50">
                        NIP {entry.nip}
                    </div>
                </div>
                <Link
                href={`/items/${id}/edit`}
                className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-black"
                >
                Edytuj
                </Link>
            </div>
          )}
        </div>

        {isLoading && <p className="text-sm text-zinc-500">Loading…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {entry && (
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <h1 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50">
                    Instancja
                    </h1>
                    <dl className="space-y-3 text-sm">
                        <Row label="Adres" value={entry.link} isLink />
                        <Row label="Wersja" value={entry.version} />
                        <Row label="Pakiet" value={entry.packetInfo} asPill />
                        <Row label="Karta w BUR" value={entry.BURLink} isLink />
                        <Row label="Strona Firmy" value={entry.PageLink} isLink />
                    </dl>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                        <h1 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50">
                            Płatności
                        </h1>
                        <dl className="space-y-3 text-sm">
                            <Row label="Detale Płatności" value={entry.paymentInfo} />
                        </dl>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                        <h1 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50">
                            Dostęp do instalacji
                        </h1>
                        <dl className="space-y-3 text-sm">
                            <Row label="Login" value={entry.login} />
                            <Row label="Hasło" value={entry.password} isPassword />
                        </dl>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}


function Row({
  label,
  value,
  isLink = false,
  asPill = false,
  isPassword = false,
}: RowProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (!value) return null;

  return (
    <div className="flex flex-col gap-0.5 border-b border-zinc-100 pb-3 dark:border-zinc-800">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        {label}
      </dt>

      <dd className="text-zinc-800 dark:text-zinc-200">
        {asPill ? (
          <span className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {value}
          </span>
        ) : isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {value}
          </a>
        ) : isPassword ? (
          <div className="flex items-center gap-2">
            <span className="font-mono">
              {showPassword ? value : "•".repeat(value.length)}
            </span>

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
                type="button"
                onClick={() => navigator.clipboard.writeText(value)}
                className="text-xs text-blue-600 hover:underline"
                >
                Copy
            </button>
          </div>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
