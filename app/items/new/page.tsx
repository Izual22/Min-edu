"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ItemForm from "@/app/components/ItemForm";
import { Item } from "@/types";

export default function NewItem() {
  const router = useRouter();

  async function handleSubmit(form: Omit<Item, "id">) {
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const created = await res.json();
    router.push(`/items/${created.id}`);
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-16 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-zinc-500 hover:text-black dark:hover:text-zinc-50"
        >
          ← Back to items
        </Link>
        <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
          Add item
        </h1>
        <ItemForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/")}
          submitLabel="Add item"
        />
      </div>
    </div>
  );
}
