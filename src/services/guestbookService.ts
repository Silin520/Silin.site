import { demoGuestbookEntries, GUESTBOOK_LIMITS, type GuestbookEntry } from "@/data/guestbook";

/**
 * Guestbook data adapter.
 *
 * CURRENT MODE: "demo" — entries are stored in this browser's localStorage only.
 * Nothing is sent to a server. To connect a real backend, implement `remoteGuestbookService`
 * (fetch/POST to your API) and switch `guestbookService` at the bottom of this file.
 */

export type GuestbookInput = { name: string; email?: string; message: string };

export interface GuestbookService {
  readonly mode: "demo" | "remote";
  list(): Promise<GuestbookEntry[]>;
  submit(input: GuestbookInput): Promise<GuestbookEntry>;
}

const STORAGE_KEY = "silin-space:guestbook:demo:v1";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function validateGuestbook(input: GuestbookInput) {
  const errors: Partial<Record<"name" | "email" | "message", string>> = {};
  const name = input.name.trim();
  const message = input.message.trim();
  const email = (input.email ?? "").trim();
  if (!name) errors.name = "NICKNAME IS REQUIRED";
  else if (name.length > GUESTBOOK_LIMITS.name) errors.name = `MAX ${GUESTBOOK_LIMITS.name} CHARACTERS`;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "INVALID EMAIL FORMAT";
  if (email.length > GUESTBOOK_LIMITS.email) errors.email = `MAX ${GUESTBOOK_LIMITS.email} CHARACTERS`;
  if (!message) errors.message = "MESSAGE IS REQUIRED";
  else if (message.length < GUESTBOOK_LIMITS.messageMin) errors.message = `MIN ${GUESTBOOK_LIMITS.messageMin} CHARACTERS`;
  else if (message.length > GUESTBOOK_LIMITS.message) errors.message = `MAX ${GUESTBOOK_LIMITS.message} CHARACTERS`;
  return errors;
}

function readLocal(): GuestbookEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestbookEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const demoGuestbookService: GuestbookService = {
  mode: "demo",
  async list() {
    await delay(250);
    const local = readLocal();
    return [...local, ...demoGuestbookEntries];
  },
  async submit(input) {
    await delay(900);
    const errors = validateGuestbook(input);
    if (Object.keys(errors).length) throw new Error("VALIDATION FAILED");
    const entry: GuestbookEntry = {
      id: `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: input.name.trim(),
      message: input.message.trim(),
      createdAt: new Date().toISOString(),
      source: "local",
    };
    try {
      const next = [entry, ...readLocal()];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      throw new Error("LOCAL STORAGE UNAVAILABLE — MESSAGE NOT SAVED");
    }
    return entry;
  },
};

// Future: implement against your real API.
// const remoteGuestbookService: GuestbookService = {
//   mode: "remote",
//   async list() { const r = await fetch("/api/guestbook"); return r.json(); },
//   async submit(input) { const r = await fetch("/api/guestbook", { method: "POST", body: JSON.stringify(input) }); return r.json(); },
// };

export const guestbookService: GuestbookService = demoGuestbookService;
