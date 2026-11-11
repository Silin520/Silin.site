"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";
import { GUESTBOOK_LIMITS, type GuestbookEntry } from "@/data/guestbook";
import { guestbookService, validateGuestbook } from "@/services/guestbookService";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

function formatDate(e: GuestbookEntry) {
  if (e.source === "demo-seed") return "[YYYY.MM.DD]";
  const d = new Date(e.createdAt);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function GuestbookClient() {
  const [entries, setEntries] = useState<GuestbookEntry[] | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let alive = true;
    guestbookService.list().then((list) => alive && setEntries(list));
    return () => {
      alive = false;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    const v = validateGuestbook({ name, email, message });
    setErrors(v);
    if (Object.keys(v).length) {
      setStatus("error");
      setFeedback("PLEASE FIX THE HIGHLIGHTED FIELDS");
      return;
    }
    setStatus("submitting");
    setFeedback("");
    try {
      const entry = await guestbookService.submit({ name, email, message });
      setEntries((prev) => [entry, ...(prev ?? [])]);
      setName("");
      setEmail("");
      setMessage("");
      setStatus("success");
      setFeedback(guestbookService.mode === "demo" ? "SIGNAL STORED IN THIS BROWSER (DEMO MODE) — NOT SENT TO A SERVER" : "SIGNAL TRANSMITTED");
    } catch (err) {
      setStatus("error");
      setFeedback(err instanceof Error ? err.message : "TRANSMISSION FAILED — TRY AGAIN");
    }
  };

  const total = entries?.length ?? 0;

  return (
    <section className="wrap grid gap-14 pb-12 lg:grid-cols-12" aria-label="Guestbook">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          {guestbookService.mode === "demo" && (
            <div className="mb-6 flex items-start gap-3 border border-neon-lime/30 bg-neon-lime/[0.04] p-4">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-neon-lime" />
              <p className="font-mono text-[0.68rem] leading-relaxed tracking-[0.1em] text-mute">
                <span className="text-neon-lime">DEMO MODE</span> — messages are saved only in this browser (localStorage). No backend is connected; nothing is sent to a server. Entries marked [DEMO] are placeholders.
              </p>
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="space-y-6 border hairline bg-deep/60 p-6 md:p-8" aria-busy={status === "submitting"}>
            <p className="label label-cyan">TRANSMIT / NEW SIGNAL</p>

            <div>
              <label htmlFor="gb-name" className="label mb-2 flex justify-between">
                <span>NICKNAME *</span>
                <span>{name.length}/{GUESTBOOK_LIMITS.name}</span>
              </label>
              <input id="gb-name" className="field" value={name} maxLength={GUESTBOOK_LIMITS.name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "gb-name-err" : undefined} autoComplete="nickname" placeholder="Who are you?" />
              {errors.name && <p id="gb-name-err" className="mt-2 font-mono text-[0.65rem] tracking-[0.15em] text-neon-magenta">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="gb-email" className="label mb-2 block">EMAIL (OPTIONAL)</label>
              <input id="gb-email" type="email" className="field" value={email} maxLength={GUESTBOOK_LIMITS.email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "gb-email-err" : undefined} autoComplete="email" placeholder="you@example.com — never displayed" />
              {errors.email && <p id="gb-email-err" className="mt-2 font-mono text-[0.65rem] tracking-[0.15em] text-neon-magenta">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="gb-message" className="label mb-2 flex justify-between">
                <span>MESSAGE *</span>
                <span className={message.length > GUESTBOOK_LIMITS.message * 0.9 ? "text-neon-magenta" : ""}>{message.length}/{GUESTBOOK_LIMITS.message}</span>
              </label>
              <textarea id="gb-message" className="field min-h-36 resize-y" value={message} maxLength={GUESTBOOK_LIMITS.message} onChange={(e) => setMessage(e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? "gb-message-err" : undefined} placeholder="Leave a signal…" />
              {errors.message && <p id="gb-message-err" className="mt-2 font-mono text-[0.65rem] tracking-[0.15em] text-neon-magenta">{errors.message}</p>}
            </div>

            <button type="submit" className="btn w-full justify-center" disabled={status === "submitting"}>
              {status === "submitting" ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> TRANSMITTING…
                </>
              ) : (
                <>
                  <Send size={15} /> SEND SIGNAL
                </>
              )}
            </button>

            <div aria-live="polite" className="min-h-6">
              {status === "success" && (
                <p className="flex items-start gap-2 font-mono text-[0.68rem] leading-relaxed tracking-[0.1em] text-neon-lime">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" /> {feedback}
                </p>
              )}
              {status === "error" && (
                <p className="flex items-start gap-2 font-mono text-[0.68rem] leading-relaxed tracking-[0.1em] text-neon-magenta">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {feedback}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="mb-6 flex items-center justify-between border-b hairline pb-4">
          <p className="label">ARCHIVE</p>
          <p className="font-mono text-xs text-dim">{entries ? `${String(total).padStart(3, "0")} RECORDS` : "SCANNING…"}</p>
        </div>

        {!entries ? (
          <div className="space-y-4" aria-label="Loading messages">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse border hairline bg-deep/50" />
            ))}
          </div>
        ) : (
          <ol className="space-y-4">
            {entries.map((en, i) => (
              <li
                key={en.id}
                className="group relative border hairline bg-deep/50 p-6 transition-colors hover:border-neon-cyan/40"
                style={i === 0 && status === "success" ? { animation: "page-in 0.6s ease both" } : undefined}
              >
                <span aria-hidden="true" className="absolute left-0 top-0 h-6 w-px bg-neon-cyan opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-3">
                    <span className="font-mono text-xs text-neon-cyan">No.{String(total - i).padStart(3, "0")}</span>
                    <span className="font-display text-lg">{en.name}</span>
                    {en.source === "demo-seed" && <span className="border border-neon-lime/40 px-1.5 py-0.5 font-mono text-[0.55rem] tracking-[0.2em] text-neon-lime">DEMO</span>}
                    {en.source === "local" && <span className="border border-neon-violet/40 px-1.5 py-0.5 font-mono text-[0.55rem] tracking-[0.2em] text-neon-violet">LOCAL</span>}
                  </p>
                  <time dateTime={en.source === "demo-seed" ? undefined : en.createdAt} className="font-mono text-[0.65rem] tracking-[0.18em] text-dim">
                    {formatDate(en)}
                  </time>
                </div>
                <p className="whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed text-mute">{en.message}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
