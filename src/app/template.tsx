import type { ReactNode } from "react";

// Re-mounts on every navigation → plays the page transition (fade / slice / neon sweep).
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="page-sweep" aria-hidden="true" />
      <div className="page-enter">{children}</div>
    </>
  );
}
