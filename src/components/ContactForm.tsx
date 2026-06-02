"use client";

import { useSearchParams } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { submitContactForm } from "@/app/actions/submit-contact-form";

type Prefill = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export function ContactForm() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  // Read prefilled values from URL parameters
  const prefill: Prefill = {
    name: searchParams.get("name") ?? undefined,
    email: searchParams.get("email") ?? undefined,
    subject: searchParams.get("subject") ?? undefined,
    message: searchParams.get("message") ?? undefined,
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus(null);

    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result.success) {
        form.reset();
        setStatus({
          tone: "success",
          message: "Message sent. Madhu will reply as soon as possible.",
        });
        return;
      }

      setStatus({ tone: "error", message: result.error });
    });
  };

  return (
    <form
      key={`${prefill.subject ?? ""}|${prefill.message ?? ""}`}
      className="space-y-4 rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-md"
      onSubmit={handleSubmit}
    >
      <input type="text" name="hp_field" className="hidden" tabIndex={-1} />

      <Field label="Name" name="name" required defaultValue={prefill.name} />

      <Field
        label="Email"
        name="email"
        type="email"
        required
        defaultValue={prefill.email}
      />

      <Field
        label="Subject"
        name="subject"
        required
        defaultValue={prefill.subject}
      />

      <Field
        label="Message"
        name="message"
        textarea
        required
        defaultValue={prefill.message}
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send message"}
      </button>

      {status ? (
        <p
          className={`rounded-lg border px-4 py-3 text-sm transition-all duration-300 ${
            status.tone === "success"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-destructive/30 bg-destructive/10 text-destructive-foreground"
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  textarea,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  defaultValue?: string;
}) {
  const className =
    "w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:bg-background";

  const id = `contact-page-${name}`;

  return (
    <label htmlFor={id} className="block text-left">
      <span className="mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase font-medium">
        {label}
        {required ? " *" : ""}
      </span>
      {textarea ? (
        <textarea
          key={defaultValue ?? ""}
          id={id}
          name={name}
          required={required}
          rows={5}
          className={className}
          defaultValue={defaultValue}
        />
      ) : (
        <input
          key={defaultValue ?? ""}
          id={id}
          name={name}
          type={type}
          required={required}
          className={className}
          defaultValue={defaultValue}
        />
      )}
    </label>
  );
}
