import { useEffect, useState } from "react";
import { MessageCircle, X, Mail, Phone, Linkedin, Github } from "lucide-react";

const channels = [
  {
    label: "Email",
    detail: "madhu.kumar245@gmail.com",
    href: "mailto:madhu.kumar245@gmail.com",
    Icon: Mail,
  },
  {
    label: "WhatsApp",
    detail: "+91 99854 22444",
    href: "https://wa.me/919985422444",
    Icon: Phone,
  },
  {
    label: "LinkedIn",
    detail: "Connect with me",
    href: "https://www.linkedin.com/in/madhu-dadi-54684531",
    Icon: Linkedin,
  },
  {
    label: "GitHub",
    detail: "@madhu2456",
    href: "https://github.com/madhu2456",
    Icon: Github,
  },
];

export function ChatBubble() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden">
      {open && (
        <div
          role="dialog"
          aria-label="Contact Madhu"
          className="mb-3 w-[20rem] origin-bottom-right animate-fade-up rounded-2xl border border-border bg-surface-elevated shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="font-display text-base">Let's talk</p>
              <p className="text-xs text-muted-foreground">
                Pick a channel, I usually reply within a day.
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close contact panel"
              className="rounded-md p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
          <ul className="p-2">
            {channels.map(({ label, detail, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={16} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-foreground">
                      {label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {detail}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close contact panel" : "Open contact panel"}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl ring-1 ring-black/10 transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
