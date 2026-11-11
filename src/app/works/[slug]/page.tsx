import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getRelatedWorks, getWork, works } from "@/data/works";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/Button";

type Params = { slug: string };

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getWork(slug)?.title ?? "Project" };
}

export default async function WorkDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();
  const related = getRelatedWorks(slug);
  const idx = works.findIndex((w) => w.slug === slug);

  const sections = [
    { n: "01", title: "BACKGROUND", text: work.background },
    { n: "02", title: "DESIGN GOALS", text: work.goals },
    { n: "03", title: "PROCESS", text: work.process },
  ];

  return (
    <article className="page-top">
      <div className="wrap">
        <Link href="/works" className="link-line mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-mute hover:text-neon-cyan">
          <ArrowLeft size={14} /> All works
        </Link>
        <p className="label mb-5">
          <span className="text-neon-cyan">{String(idx + 1).padStart(2, "0")}</span> — {work.category} — {work.year}
        </p>
        <h1 className="display text-[clamp(2.6rem,9vw,8rem)]">
          <span className="glitch glitch-auto" data-text={work.title}>
            {work.title}
          </span>
        </h1>

        <div className="media-frame mt-12 aspect-[16/9] border hairline md:aspect-[21/9]">
          <PlaceholderImage src={work.cover} alt={`${work.title} main visual`} hue={work.hue} label="[PROJECT MAIN VISUAL]" />
        </div>

        <div className="mt-14 grid gap-12 md:grid-cols-12">
          <p className="text-xl leading-relaxed text-ink md:col-span-7 md:text-2xl">{work.summary}</p>
          <dl className="grid grid-cols-2 gap-6 md:col-span-4 md:col-start-9">
            <div>
              <dt className="label">CATEGORY</dt>
              <dd className="mt-2 font-mono text-sm text-ink">{work.category}</dd>
            </div>
            <div>
              <dt className="label">YEAR</dt>
              <dd className="mt-2 font-mono text-sm text-ink">{work.year}</dd>
            </div>
            <div className="col-span-2">
              <dt className="label">STACK</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {work.stack.map((s) => (
                  <span key={s} className="border border-neon-violet/40 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-widest text-neon-violet">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-24 border-t hairline">
          {sections.map((s) => (
            <section key={s.n} className="grid gap-6 border-b hairline py-12 md:grid-cols-12 md:py-16">
              <p className="font-mono text-sm text-neon-cyan md:col-span-1">{s.n}</p>
              <h2 className="display text-3xl md:col-span-4 md:text-5xl">{s.title}</h2>
              <p className="text-lg leading-[1.9] text-mute md:col-span-6 md:col-start-7">{s.text}</p>
            </section>
          ))}
        </div>

        <section className="mt-24" aria-label="Project images">
          <p className="label mb-6">SHOWCASE</p>
          <div className="grid gap-6 md:grid-cols-12">
            <div className="media-frame aspect-[4/3] border hairline md:col-span-8">
              <PlaceholderImage src={work.images[0]} alt={`${work.title} showcase 1`} hue={work.hue} label="[SHOWCASE 01]" />
            </div>
            <div className="media-frame aspect-[3/4] border hairline md:col-span-4 md:mt-20">
              <PlaceholderImage src={work.images[1]} alt={`${work.title} showcase 2`} hue={work.hue + 60} label="[SHOWCASE 02]" />
            </div>
            <div className="media-frame aspect-[16/8] border hairline md:col-span-12">
              <PlaceholderImage src={work.images[2]} alt={`${work.title} showcase 3`} hue={work.hue + 120} label="[SHOWCASE 03]" />
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-6 md:grid-cols-12">
          <h2 className="display text-3xl md:col-span-4 md:text-5xl">FINAL RESULT</h2>
          <p className="text-lg leading-[1.9] text-mute md:col-span-6 md:col-start-7">{work.result}</p>
        </section>

        <section className="mt-32" aria-label="Related works">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="display text-3xl md:text-5xl">RELATED</h2>
            <Button href="/works" variant="ghost">
              All works
            </Button>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {related.map((w) => (
              <ProjectCard key={w.slug} work={w} index={works.indexOf(w)} aspect="aspect-[4/3]" />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
