"use client";

import { useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useState, useTransition } from "react";
import { submitContactForm } from "@/app/actions/submit-contact-form";

type ContactIntent = {
  subject: string;
  message: string;
};

const CONTACT_INTENTS: Record<string, ContactIntent> = {
  "ai-llm": {
    subject: "AI & LLM Application Development Inquiry",
    message: `Hi Madhu,

I read your AI & LLM Application Development service page and would love to schedule a technical discovery call.

About our project:
- Goals / Features:
- Preferred Tech Stack:
- Desired Timeline:
- Budget Guideline:

Let's connect!`,
  },
  rag: {
    subject: "RAG Consulting Inquiry",
    message: `Hi Madhu,

I read your RAG Consultant page and would love to discuss a custom RAG / semantic search implementation.

Project Scope:
- Types of Documents:
- Volume of Data:
- Expected Target Latency:

Let's connect!`,
  },
  "ai-agent": {
    subject: "AI Agent Development Inquiry",
    message: `Hi Madhu,

I read your AI Agent Development service page and would love to schedule a discovery call.

Project Scope:
- Intended Agent Tasks:
- Required Tools / APIs:
- Estimated Run Scope:

Looking forward to speaking with you!`,
  },
  "marketing-analytics": {
    subject: "Marketing Analytics Inquiry",
    message: `Hi Madhu,

I read your Marketing Analytics Consultant page and would love to discuss a custom measurement or dashboard project.

Project Scope:
- Primary Telemetry Needs:
- Current Data Stack:
- Key Business Outcomes to Track:

Let's connect!`,
  },
  "ga4-bigquery": {
    subject: "GA4 & BigQuery Campaign Analytics Inquiry",
    message: `Hi Madhu,

I read your GA4 & BigQuery Campaign Analytics page and would love to discuss a custom measurement or dashboard project.

Project Scope:
- Primary Tracking Needs:
- Current Data Warehouse / Analytics Stack:
- Key Campaign Outcomes to Track:

Let's connect!`,
  },
  "full-stack-ai": {
    subject: "Full-Stack AI Product Inquiry",
    message: `Hi Madhu,

I read your Full-Stack AI Product Development page and would love to discuss an end-to-end product engineering project.

Project Scope / Vision:
- Primary Product Idea:
- Core Tech Stack Requirements:
- Expected Integrations:
- Target Launch Timeline:

Let's connect!`,
  },
  "full-time": {
    subject: "Hiring inquiry, full-time AI & Analytics Engineer",
    message: `Hi Madhu,

We'd like to talk about a full-time role.

Company:
Role / team:
Location:
Tech stack:
Ideal start date:

Looking forward to connecting.`,
  },
};

function getHashIntent(): string | null {
  if (typeof window === "undefined") return null;

  const hash = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);

  return params.get("intent");
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const queryIntent = searchParams.get("intent");
  const querySubject = searchParams.get("subject");
  const queryMessage = searchParams.get("message");

  // Name and email pre-population is direct
  const namePrefill = searchParams.get("name") ?? undefined;
  const emailPrefill = searchParams.get("email") ?? undefined;

  useEffect(() => {
    const handleHashChange = () => {
      const hashIntent = getHashIntent();
      const intent = hashIntent || queryIntent;

      if (querySubject) {
        setSubject(querySubject);
      }
      if (queryMessage) {
        setMessage(queryMessage);
      }

      if (!querySubject && !queryMessage && intent && CONTACT_INTENTS[intent]) {
        setSubject(CONTACT_INTENTS[intent].subject);
        setMessage(CONTACT_INTENTS[intent].message);
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [queryIntent, querySubject, queryMessage]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus(null);

    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result.success) {
        form.reset();
        setSubject("");
        setMessage("");
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
      key={`${querySubject ?? ""}|${queryMessage ?? ""}`}
      className="space-y-4 rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-md"
      onSubmit={handleSubmit}
    >
      <input type="text" name="hp_field" className="hidden" tabIndex={-1} />

      <Field label="Name" name="name" required defaultValue={namePrefill} />

      <Field
        label="Email"
        name="email"
        type="email"
        required
        defaultValue={emailPrefill}
      />

      <Field
        label="Subject"
        name="subject"
        required
        value={subject}
        onChange={(val) => setSubject(val)}
      />

      <Field
        label="Message"
        name="message"
        textarea
        required
        value={message}
        onChange={(val) => setMessage(val)}
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
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (val: string) => void;
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
          id={id}
          name={name}
          required={required}
          rows={5}
          className={className}
          {...(value !== undefined ? { value } : { defaultValue })}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          className={className}
          {...(value !== undefined ? { value } : { defaultValue })}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      )}
    </label>
  );
}
