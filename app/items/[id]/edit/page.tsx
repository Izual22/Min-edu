"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ItemForm from "@/app/components/ItemForm";
import { Item } from "@/types";

export default function EditItem() {
  const { id } = useParams();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);;

  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setInitialValues)
      .catch(() => setError("Couldn't load this item."))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleSubmit(form: Omit<Item, "id">) {
    const res = await fetch(`/api/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    await res.json();
    router.push(`/items/${id}`);
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-16 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/items/${id}`}
          className="mb-6 inline-block text-sm text-zinc-500 hover:text-black dark:hover:text-zinc-50"
        >
          ← Back to item
        </Link>
        <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
          Edit item
        </h1>

        {isLoading && <p className="text-sm text-zinc-500">Loading…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {initialValues && (
          <ItemForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/items/${id}`)}
            submitLabel="Save changes"
          />
        )}
      </div>
    </div>
  );
}
