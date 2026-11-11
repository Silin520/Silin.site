import type { ReactNode } from "react";

type Props = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  glitchText?: string;
  className?: string;
  as?: "h1" | "h2";
  size?: "xl" | "lg";
};

export function SectionHeading({ index, eyebrow, title, glitchText, className = "", as: Tag = "h2", size = "lg" }: Props) {
  const sizeCls = size === "xl" ? "text-[clamp(3rem,11vw,9.5rem)]" : "text-[clamp(2.4rem,7vw,5.5rem)]";
  return (
    <div className={className}>
      <div className="mb-5 flex items-center gap-4">
        <span className="font-mono text-xs text-neon-cyan">{index}</span>
        <span className="h-px w-12 bg-gradient-to-r from-neon-cyan to-transparent" />
        <span className="label">{eyebrow}</span>
      </div>
      <Tag className={`display ${sizeCls}`}>
        {glitchText ? (
          <span className="glitch glitch-auto" data-text={glitchText}>
            {title}
          </span>
        ) : (
          title
        )}
      </Tag>
    </div>
  );
}
