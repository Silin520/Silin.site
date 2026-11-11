"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { BlogPost } from "@/data/blog";
import { ArticleCard } from "@/components/ui/ArticleCard";

const PAGE_SIZE = 4;

type Props = { posts: BlogPost[]; categories: string[] };

export function BlogExplorer({ posts, categories }: Props) {
  const [category, setCategory] = useState("ALL");
  const [tag, setTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const tags = useMemo(() => Array.from(new Set(posts.flatMap((p) => p.tags))), [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (category === "ALL" || p.category === category) &&
        (!tag || p.tags.includes(tag)) &&
        (!q || `${p.title} ${p.excerpt} ${p.category} ${p.tags.join(" ")}`.toLowerCase().includes(q)),
    );
  }, [posts, category, tag, query]);

  const reset = () => setLimit(PAGE_SIZE);
  const shown = filtered.slice(0, limit);

  return (
    <section className="wrap py-16 md:py-24" aria-label="All articles">
      <div className="mb-10 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="label mb-3">CATEGORY</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => {
                  setCategory(c);
                  reset();
                }}
                className={`border px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] transition-all ${
                  category === c ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_18px_-6px_var(--color-neon-cyan)]" : "hairline text-mute hover:border-neon-violet hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="label mb-3 mt-6">TAG</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tag === t}
                onClick={() => {
                  setTag(tag === t ? null : t);
                  reset();
                }}
                className={`px-2 py-1 font-mono text-[0.65rem] uppercase tracking-widest transition-colors ${tag === t ? "text-neon-magenta" : "text-dim hover:text-ink"}`}
              >
                # {t.replace(/[\[\]]/g, "")}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-4">
          <label htmlFor="blog-search" className="label mb-3 block">
            SEARCH
          </label>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dim" />
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                reset();
              }}
              placeholder="Search articles…"
              className="field !pl-11"
            />
          </div>
          <p className="mt-3 font-mono text-[0.65rem] tracking-[0.2em] text-dim" aria-live="polite">
            {filtered.length} RESULT{filtered.length === 1 ? "" : "S"}
          </p>
        </div>
      </div>

      {shown.length ? (
        <div className="border-b hairline">
          {shown.map((p, i) => (
            <ArticleCard key={p.slug} post={p} index={posts.indexOf(p)} variant={i === 0 && false ? "tile" : "row"} />
          ))}
        </div>
      ) : (
        <div className="border hairline px-6 py-20 text-center">
          <p className="pixel text-sm text-neon-magenta">NO SIGNAL FOUND</p>
          <p className="mt-3 text-sm text-mute">No articles match the current filters.</p>
          <button
            type="button"
            className="link-line mt-6 font-mono text-xs uppercase tracking-[0.2em] text-neon-cyan"
            onClick={() => {
              setCategory("ALL");
              setTag(null);
              setQuery("");
              reset();
            }}
          >
            Reset filters
          </button>
        </div>
      )}

      {filtered.length > limit && (
        <div className="mt-12 flex justify-center">
          <button type="button" className="btn btn-ghost" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
            Load more <span className="font-mono text-dim">({filtered.length - limit})</span>
          </button>
        </div>
      )}
    </section>
  );
}
