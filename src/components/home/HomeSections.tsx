import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { aboutConfig, pageIntro } from "@/data/site";
import { works } from "@/data/works";
import { blogPosts } from "@/data/blog";
import { galleryItems } from "@/data/gallery";

export function Marquee() {
  const text = "DIGITAL CREATOR / DESIGN / EXPLORATION / ";
  return (
    <div className="overflow-hidden border-y hairline bg-void/40 py-4" aria-hidden="true">
      <div className="marquee">
        {[0, 1].map((k) => (
          <span key={k} className="pixel whitespace-nowrap pr-6 text-sm text-dim md:text-base">
            {text.repeat(4)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="wrap relative py-28 md:py-44">
      <span aria-hidden="true" className="display outline-text pointer-events-none absolute -left-4 top-10 select-none text-[28vw] leading-none opacity-40 md:text-[18vw]">
        01
      </span>
      <div className="relative grid gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <Reveal>
            <SectionHeading index="01" eyebrow="IDENTITY / PROFILE" title="ABOUT" glitchText="ABOUT" size="xl" />
          </Reveal>
          <Reveal delay={120} className="mt-10 max-w-xl space-y-5 md:ml-20">
            {aboutConfig.body.map((p, i) => (
              <p key={i} className="text-lg leading-[1.9] text-mute">
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={200} className="mt-10 flex flex-wrap gap-2 md:ml-20">
            {aboutConfig.tags.map((t) => (
              <span key={t} className="border border-neon-cyan/30 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-neon-cyan/90">
                {t}
              </span>
            ))}
          </Reveal>
          <Reveal delay={280} className="mt-14 grid max-w-xl grid-cols-1 gap-px bg-white/[0.08] sm:grid-cols-3 md:ml-20">
            {aboutConfig.focus.map((f) => (
              <div key={f.code} className="bg-void/80 p-5">
                <p className="font-mono text-[0.65rem] text-neon-violet">{f.code}</p>
                <p className="mt-3 text-sm text-ink">{f.label}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal delay={150} className="relative md:col-span-5 md:mt-24">
          <div className="relative mx-auto max-w-sm">
            <div className="media-frame aspect-[3/4] rotate-[2.5deg] border border-white/10">
              <PlaceholderImage src={null} alt="About section visual placeholder" hue={265} label="[ABOUT IMAGE]" />
              <span className="neon-edge" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden aspect-square w-32 -rotate-6 border border-neon-cyan/40 bg-void/70 p-3 backdrop-blur md:block">
              <p className="label label-cyan">DATA</p>
              <p className="pixel mt-2 text-[0.6rem] leading-relaxed text-mute">
                [FACT 01]
                <br />
                [FACT 02]
              </p>
            </div>
            <span className="absolute -right-3 top-8 origin-top-right rotate-90 font-mono text-[0.6rem] tracking-[0.3em] text-dim">FIG. 01 — [CAPTION]</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SelectedWorksSection() {
  const list = works.slice(0, 4);
  const layout = [
    { col: "md:col-span-7", aspect: "aspect-[4/3]", mt: "" },
    { col: "md:col-span-5", aspect: "aspect-[4/5]", mt: "md:mt-28" },
    { col: "md:col-span-5 md:col-start-2", aspect: "aspect-square", mt: "md:-mt-10" },
    { col: "md:col-span-6", aspect: "aspect-[16/10]", mt: "md:mt-16" },
  ];
  return (
    <section className="wrap py-24 md:py-36">
      <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
        <Reveal>
          <SectionHeading index="02" eyebrow="SELECTED WORKS" title={<>SELECTED<br />WORKS</>} />
        </Reveal>
        <Reveal delay={100} className="max-w-xs">
          <p className="mb-6 text-mute">{pageIntro.works}</p>
          <Button href="/works">View all works</Button>
        </Reveal>
      </div>
      <div className="grid gap-x-10 gap-y-16 md:grid-cols-12">
        {list.map((w, i) => (
          <Reveal key={w.slug} delay={(i % 2) * 120} className={`${layout[i].col} ${layout[i].mt}`}>
            <ProjectCard work={w} index={i} aspect={layout[i].aspect} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function LatestJournalSection() {
  const [lead, ...rest] = blogPosts;
  return (
    <section className="wrap py-24 md:py-36">
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <SectionHeading index="03" eyebrow="LATEST JOURNAL" title="JOURNAL" glitchText="JOURNAL" />
        </Reveal>
        <Reveal delay={100}>
          <Button href="/blog" variant="ghost">
            Read all journals
          </Button>
        </Reveal>
      </div>
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <Reveal className="md:col-span-7">
          <ArticleCard post={lead} index={0} variant="tile" />
        </Reveal>
        <div className="md:col-span-5">
          {rest.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <Link href={`/blog/${p.slug}`} className="card-hover group flex items-start gap-5 border-t hairline py-6 last:border-b" aria-label={`${p.title} — read article`}>
                <span className="font-display text-3xl text-white/20 transition-colors group-hover:text-neon-cyan">{String(i + 2).padStart(2, "0")}</span>
                <div className="flex-1">
                  <p className="label mb-2">
                    <span className="text-neon-cyan">{p.category}</span> · {p.date}
                  </p>
                  <h3 className="display text-xl transition-transform duration-500 group-hover:translate-x-1 md:text-2xl">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-mute">{p.excerpt}</p>
                </div>
                <ArrowUpRight size={18} className="mt-1 text-dim transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-neon-cyan" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GalleryPreviewSection() {
  const frames = galleryItems.slice(0, 5);
  const offsets = ["md:mt-0", "md:mt-16", "md:-mt-4", "md:mt-24", "md:mt-6"];
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="wrap">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <SectionHeading index="04" eyebrow="VISUAL ARCHIVE" title={<>VISUAL<br />ARCHIVE</>} />
          </Reveal>
          <Reveal delay={100}>
            <Button href="/gallery">Explore gallery</Button>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6" style={{ perspective: "1200px" }}>
          {frames.map((f, i) => (
            <Reveal key={f.id} delay={i * 90} className={`${offsets[i]} ${i === 4 ? "col-span-2 md:col-span-1" : ""}`}>
              <Link
                href="/gallery"
                className="card-hover group relative block transition-transform duration-700 hover:z-10 hover:scale-[1.04]"
                style={{ rotate: `${f.rotate}deg` }}
                aria-label={`${f.title} — open gallery`}
              >
                <div style={{ animation: `float-y ${6 + i}s ease-in-out ${i * 0.4}s infinite` }}>
                  <div className="media-frame border border-white/10" style={{ aspectRatio: i % 2 ? "3/4" : "4/5" }}>
                    <PlaceholderImage src={f.src} alt={f.title} hue={f.hue} label={`[FRAME ${String(i + 1).padStart(2, "0")}]`} />
                    <span className="neon-edge" />
                  </div>
                  <p className="mt-3 font-mono text-[0.6rem] tracking-[0.2em] text-dim">{f.coord}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GuestbookCTA() {
  return (
    <section className="wrap py-24 md:py-40">
      <Reveal className="relative overflow-hidden border hairline px-6 py-20 text-center md:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {[40, 70, 100, 140].map((s, i) => (
            <span key={s} className="absolute rounded-full border border-neon-cyan/15" style={{ width: `${s}%`, aspectRatio: "1", opacity: 1 - i * 0.2, animation: `float-y ${5 + i}s ease-in-out infinite` }} />
          ))}
          <div className="absolute inset-0" style={{ background: "radial-gradient(50% 60% at 50% 50%, rgba(139,92,255,0.22), transparent 70%)" }} />
        </div>
        <p className="label label-cyan relative mb-6">05 / GUESTBOOK</p>
        <h2 className="display relative text-[clamp(2.6rem,9vw,8rem)]">
          <span className="glitch glitch-auto" data-text="LEAVE A SIGNAL">
            LEAVE A SIGNAL
          </span>
        </h2>
        <p className="relative mx-auto mt-6 max-w-md text-mute">{pageIntro.guestbook}</p>
        <div className="relative mt-10">
          <Button href="/guestbook">Open guestbook</Button>
        </div>
      </Reveal>
    </section>
  );
}
