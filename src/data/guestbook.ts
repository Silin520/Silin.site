// Demo seed entries. These are NOT real visitor messages and are labelled as demo data in the UI.

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string; // ISO string
  /** "demo-seed" = bundled placeholder, "local" = written in this browser (localStorage), "remote" = future real backend */
  source: "demo-seed" | "local" | "remote";
};

export const demoGuestbookEntries: GuestbookEntry[] = [
  { id: "demo-001", name: "[DEMO VISITOR 01]", message: "[DEMO MESSAGE 01 — placeholder text, not a real visitor.]", createdAt: "2000-01-01T00:00:00.000Z", source: "demo-seed" },
  { id: "demo-002", name: "[DEMO VISITOR 02]", message: "[DEMO MESSAGE 02 — placeholder text, not a real visitor.]", createdAt: "2000-01-01T00:00:00.000Z", source: "demo-seed" },
  { id: "demo-003", name: "[DEMO VISITOR 03]", message: "[DEMO MESSAGE 03 — placeholder text, not a real visitor.]", createdAt: "2000-01-01T00:00:00.000Z", source: "demo-seed" },
];

export const GUESTBOOK_LIMITS = { name: 40, email: 120, message: 500, messageMin: 4 };
