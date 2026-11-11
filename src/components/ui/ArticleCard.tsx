import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/data/blog";
import { PlaceholderImage } from "./PlaceholderImage";

type Props = { post: BlogPost; index: number; variant?: "feature" | "row" | "tile" };

export function ArticleCard({ post, index, variant = "row" }: Props) {
  const n = String(index + 1).padStart(2, "0");
  const href = `/blog/${post.slug}`;

  if (variant === "feature") {
    return (
      <Link href={href} className="card-hover group grid gap-8 md:grid-cols-12 md:gap-12" aria-label={`${post.title} — read article`}>
        <div className="media-frame aspect-[16/11] md:col-span-7">
          <PlaceholderImage src={post.cover} alt={`${post.title} cover`} hue={post.hue} label="[FEATURED COVER]" />
          <span className="neon-edge" />
          <span className="absolute left-4 top-4 bg-neon-cyan px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-void">FEATURED</span>
        </div>
        <div className="flex flex-col justify-center md:col-span-5">
          <p className="label mb-4">
            <span className="text-neon-cyan">{post.category}</span> · {post.date} · {post.readTime}
          </p>
          <h3 className="display text-[clamp(2rem,4.4vw,3.6rem)] transition-colors group-hover:text-neon-cyan">{post.title}</h3>
          <p className="mt-5 max-w-md leading-relaxed text-mute">{post.excerpt}</p>
          <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-ink">
            READ ARTICLE <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "tile") {
    return (
      <Link href={href} className="card-hover group block" aria-label={`${post.title} — read article`}>
        <div className="media-frame aspect-[16/10]">
          <PlaceholderImage src={post.cover} alt={`${post.title} cover`} hue={post.hue} label={`[COVER ${n}]`} />
          <span className="neon-edge" />
        </div>
        <p className="label mt-4">
          <span className="text-neon-cyan">{post.category}</span> · {post.date}
        </p>
        <h3 className="display mt-2 text-2xl transition-colors group-hover:text-neon-cyan">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mute">{post.excerpt}</p>
      </Link>
    );
  }

  return (
    <Link href={href} className="card-hover group grid grid-cols-12 items-center gap-4 border-t hairline py-7 md:gap-8 md:py-9" aria-label={`${post.title} — read article`}>
      <span className="col-span-2 font-display text-3xl text-white/20 transition-colors group-hover:text-neon-cyan md:col-span-1 md:text-5xl">{n}</span>
      <div className="col-span-10 md:col-span-7">
        <p className="label mb-2">
          <span className="text-neon-cyan">{post.category}</span> · {post.date} · {post.readTime}
        </p>
        <h3 className="display text-2xl transition-transform duration-500 group-hover:translate-x-1 md:text-4xl">{post.title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">{post.excerpt}</p>
        <p className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="border hairline px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-dim">
              {t}
            </span>
          ))}
        </p>
      </div>
      <div className="media-frame col-span-12 aspect-[16/8] md:col-span-4 md:aspect-[4/3]">
        <PlaceholderImage src={post.cover} alt={`${post.title} cover`} hue={post.hue} label={`[COVER ${n}]`} />
        <span className="neon-edge" />
      </div>
    </Link>
  );
}
