import { Mail, Share2, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { IntroContent } from "@/types/content";

function GithubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className + " fill-none stroke-current stroke-[1.8]"}>
      <path d="M9 19c-4.5 1.4-4.5-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 4.77 5.07 5.07 0 0 0 17.91 1S16.73.65 14 2.48a13.38 13.38 0 0 0-6 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77 5.44 5.44 0 0 0 2.5 8.52c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 18.13V22" />
    </svg>
  );
}

function LinkedInIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className + " fill-none stroke-current stroke-[1.8]"}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 1 0-4 0v7h-4v-12h4v2a4 4 0 0 1 2-3Z" />
      <rect x="2" y="9" width="4" height="12" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function RequiredPlaceholder({ label, multiline = false }: { label: string; multiline?: boolean }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute left-3 text-sm text-zinc-400",
        multiline ? "top-2.5" : "top-1/2 -translate-y-1/2"
      )}
    >
      {label}
      <sup className="ml-0.5 text-[0.68em] leading-none">*</sup>
    </span>
  );
}

export function ContactModal({ email, onClose, open }: { email: string; onClose: () => void; open: boolean }) {
  const [form, setForm] = useState({
    company: "",
    contactNumber: "",
    email: "",
    fullName: "",
    message: ""
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = [
      `Full Name: ${form.fullName}`,
      `Email: ${form.email}`,
      `Contact Number: ${form.contactNumber}`,
      form.company ? `Company/Organization: ${form.company}` : "",
      "",
      "Message:",
      form.message
    ]
      .filter((line) => line !== "")
      .join("\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Portfolio contact request")}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div aria-labelledby="contact-modal-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" role="dialog">
      <button aria-label="Close contact form" className="absolute inset-0 bg-white/70 backdrop-blur-sm" onClick={onClose} type="button" />

      <div className="relative z-10 max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-md border border-zinc-950 bg-white p-6 text-zinc-950 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 id="contact-modal-title" className="font-display text-2xl leading-none text-zinc-950">
              Connect
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Send a quick message and I will get back to you.</p>
          </div>
          <button aria-label="Close contact form" className="grid h-9 w-9 shrink-0 place-items-center text-zinc-700 transition hover:text-zinc-950" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <Input aria-label="Full Name" id="contact-full-name" onChange={(event) => updateField("fullName", event.target.value)} required value={form.fullName} />
            {!form.fullName ? <RequiredPlaceholder label="Full Name" /> : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="relative">
              <Input aria-label="Contact Number" id="contact-number" onChange={(event) => updateField("contactNumber", event.target.value)} required type="tel" value={form.contactNumber} />
              {!form.contactNumber ? <RequiredPlaceholder label="Contact Number" /> : null}
            </div>
            <div className="relative">
              <Input aria-label="Email Address" id="contact-email" onChange={(event) => updateField("email", event.target.value)} required type="email" value={form.email} />
              {!form.email ? <RequiredPlaceholder label="Email Address" /> : null}
            </div>
          </div>

          <Input aria-label="Company/Organization" id="contact-company" onChange={(event) => updateField("company", event.target.value)} placeholder="Company/Organization" value={form.company} />

          <div className="relative">
            <Textarea aria-label="Message" id="contact-message" onChange={(event) => updateField("message", event.target.value)} required value={form.message} />
            {!form.message ? <RequiredPlaceholder label="Message" multiline /> : null}
          </div>

          <div className="flex justify-end gap-3">
            <Button onClick={onClose} type="button" variant="secondary">
              Cancel
            </Button>
            <Button className="border-zinc-950 bg-zinc-950 text-white hover:bg-black" type="submit">
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ContactActions({ intro }: { intro: IntroContent }) {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const items = [
    { href: intro.github_url, label: "GitHub", icon: <GithubIcon /> },
    { href: intro.linkedin_url, label: "LinkedIn", icon: <LinkedInIcon /> },
    { href: `mailto:${intro.email}`, label: "Email", icon: <Mail className="h-5 w-5" /> }
  ];

  return (
    <div className="ml-auto flex flex-wrap items-center justify-end gap-4 md:gap-5">
      <ContactModal email={intro.email} onClose={() => setContactModalOpen(false)} open={contactModalOpen} />
      <div className="flex items-center justify-end gap-4 md:gap-5">
        {items.map((item) => (
          <a
            key={item.label}
            aria-label={item.label}
            className="text-zinc-500 transition hover:text-zinc-950"
            href={item.href}
            rel="noreferrer"
            target={item.href.startsWith("http") ? "_blank" : undefined}
          >
            {item.icon}
          </a>
        ))}
        <button
          aria-label="Copy website address"
          className="text-zinc-500 transition hover:text-zinc-950"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
            } catch {
              // Ignore clipboard failures; the visible links still work.
            }
          }}
          type="button"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
      <Button onClick={() => setContactModalOpen(true)} type="button" variant="secondary">
        Connect
      </Button>
      <a download href={intro.resume_url ? "/api/resume" : "#"}>
        <Button className="min-w-[140px] border-zinc-950 bg-zinc-950 text-sm text-white hover:bg-black">
          <span>Get Resume</span>
        </Button>
      </a>
    </div>
  );
}
