import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Work } from "@/data/works";
import { PlaceholderImage } from "./PlaceholderImage";

type Props = { work: Work; index: number; aspect?: string; className?: string };

export function ProjectCard({ work, index, aspect = "aspect-[4/3]", className = "" }: Props) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <Link href={`/works/${work.slug}`} className={`card-hover group block ${className}`} aria-label={`${work.title} — view project`}>
      <div className={`media-frame ${aspect}`}>
        <PlaceholderImage src={work.cover} alt={`${work.title} cover`} hue={work.hue} label={`[COVER ${n}]`} />
        <span className="neon-edge" />
        <span className="index-pop absolute left-4 top-4 font-display text-6xl font-semibold leading-none text-white/90 mix-blend-difference md:text-7xl">{n}</span>
        <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center border border-white/20 bg-void/60 text-ink backdrop-blur transition-all duration-500 group-hover:border-neon-cyan group-hover:text-neon-cyan group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="label mb-2">
            <span className="text-neon-cyan">{n}</span> — {work.category}
          </p>
          <h3 className="display text-2xl md:text-3xl">{work.title}</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-mute">{work.summary}</p>
        </div>
        <span className="font-mono text-xs text-dim">{work.year}</span>
      </div>
    </Link>
  );
}
