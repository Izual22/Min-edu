"use client";

import { Item } from "@/types";
import { useState } from "react";

// Everything the form collects — same shape as Item, minus the server-assigned id
export type FormValues = Omit<Item, "id">;

export const emptyEntry: FormValues = {
  name: "",
  nip: "",
  link: "",
  status: "",
  version: "",
  BURLink: "",
  PageLink: "",
  login: "",
  password: "",
  paymentInfo: "",
  packetInfo: "",
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const next: FormErrors = {};
  if (!values.name.trim()) next.name = "Name is required.";
  if (!values.nip.trim()) next.nip = "NIP is required.";
  if (values.link && !/^https?:\/\//.test(values.link)) {
    next.link = "Link must start with http:// or https://";
  }
  return next;
}

interface ItemFormProps {
  initialValues?: FormValues;
  onSubmit: (form: FormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function ItemForm({
  initialValues = emptyEntry,
  onSubmit,
  onCancel,
  submitLabel,
}: ItemFormProps) {
  const [form, setForm] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof FormValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name}>
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={inputClass(errors.name)}
          />
        </Field>
        <Field label="NIP" error={errors.nip}>
          <input
            value={form.nip}
            onChange={(e) => updateField("nip", e.target.value)}
            className={inputClass(errors.nip)}
          />
        </Field>
        <Field label="Link" error={errors.link}>
          <input
            value={form.link}
            onChange={(e) => updateField("link", e.target.value)}
            className={inputClass(errors.link)}
            placeholder="https://"
          />
        </Field>
        <Field label="Status">
          <input
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Version">
          <input
            value={form.version}
            onChange={(e) => updateField("version", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="BUR link">
          <input
            value={form.BURLink}
            onChange={(e) => updateField("BURLink", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Page link">
          <input
            value={form.PageLink}
            onChange={(e) => updateField("PageLink", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Login">
          <input
            value={form.login}
            onChange={(e) => updateField("login", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Payment info">
          <input
            value={form.paymentInfo}
            onChange={(e) => updateField("paymentInfo", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Packet info">
            <textarea
              value={form.packetInfo}
              onChange={(e) => updateField("packetInfo", e.target.value)}
              rows={3}
              className={inputClass()}
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

function inputClass(error?: string) {
  return `w-full rounded-lg border px-3 py-2 text-sm outline-none dark:bg-zinc-900 dark:text-zinc-100 ${
    error
      ? "border-red-300"
      : "border-zinc-200 focus:border-zinc-400 dark:border-zinc-700"
  }`;
}