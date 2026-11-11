"use client";

import { useMemo, useState } from "react";
import type { Work } from "@/data/works";
import { ProjectCard } from "@/components/ui/ProjectCard";

// Asymmetric rhythm — repeats every 6 items.
const PATTERN = [
  { col: "md:col-span-8", aspect: "aspect-[16/10]", mt: "" },
  { col: "md:col-span-4", aspect: "aspect-[3/4]", mt: "md:mt-24" },
  { col: "md:col-span-5", aspect: "aspect-square", mt: "md:-mt-8" },
  { col: "md:col-span-7", aspect: "aspect-[4/3]", mt: "md:mt-16" },
  { col: "md:col-span-4 md:col-start-2", aspect: "aspect-[4/5]", mt: "" },
  { col: "md:col-span-6", aspect: "aspect-[16/11]", mt: "md:mt-20" },
];

export function WorksExplorer({ works, categories }: { works: Work[]; categories: string[] }) {
  const [category, setCategory] = useState("ALL");
  const filtered = useMemo(() => works.filter((w) => category === "ALL" || w.category === category), [works, category]);

  return (
    <section className="wrap pb-12" aria-label="Projects">
      <div className="mb-14 flex flex-wrap items-center justify-between gap-6 border-y hairline py-5">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {categories.map((c) => {
            const count = c === "ALL" ? works.length : works.filter((w) => w.category === c).length;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={`border px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] transition-all ${
                  category === c ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_18px_-6px_var(--color-neon-cyan)]" : "hairline text-mute hover:border-neon-violet hover:text-ink"
                }`}
              >
                {c} <span className="ml-1 text-dim">{String(count).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>
        <p className="label" aria-live="polite">
          SHOWING {String(filtered.length).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
        </p>
      </div>

      {filtered.length ? (
        <div key={category} className="grid gap-x-10 gap-y-16 md:grid-cols-12" style={{ animation: "page-in 0.6s ease both" }}>
          {filtered.map((w, i) => {
            const p = PATTERN[i % PATTERN.length];
            return <ProjectCard key={w.slug} work={w} index={works.indexOf(w)} aspect={p.aspect} className={`${p.col} ${p.mt}`} />;
          })}
        </div>
      ) : (
        <div className="border hairline px-6 py-24 text-center">
          <p className="pixel text-sm text-neon-magenta">EMPTY SECTOR</p>
          <p className="mt-3 text-sm text-mute">No projects in this category yet.</p>
        </div>
      )}
    </section>
  );
}
