import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts, getAdjacentPosts, getPost } from "@/data/blog";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

type Params = { slug: string };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post?.title ?? "Article" };
}

export default async function BlogDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const { prev, next } = getAdjacentPosts(slug);
  const headings = post.body.filter((b): b is Extract<typeof b, { type: "h2" }> => b.type === "h2");

  return (
    <article className="page-top">
      <div className="wrap">
        <Link href="/blog" className="link-line mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-mute hover:text-neon-cyan">
          <ArrowLeft size={14} /> Back to journal
        </Link>
        <p className="label mb-5">
          <span className="text-neon-cyan">{post.category}</span> · {post.date} · {post.readTime}
        </p>
        <h1 className="display max-w-5xl text-[clamp(2.4rem,7vw,6rem)]">{post.title}</h1>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-dim">
          BY <span className="text-mute">{post.author}</span> — <span className="text-mute">[AUTHOR ROLE]</span>
        </p>

        <div className="media-frame mt-12 aspect-[16/8] border hairline">
          <PlaceholderImage src={post.cover} alt={`${post.title} cover`} hue={post.hue} label="[COVER IMAGE]" />
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav aria-label="Table of contents" className="lg:sticky lg:top-28">
              <p className="label mb-4">CONTENTS</p>
              <ol className="space-y-3 border-l hairline">
                {headings.map((h, i) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 font-mono text-xs uppercase tracking-[0.12em] text-mute transition-colors hover:border-neon-cyan hover:text-neon-cyan">
                      <span className="mr-2 text-dim">{String(i + 1).padStart(2, "0")}</span>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="prose-silin lg:col-span-7 lg:max-w-[44rem]">
            {post.body.map((b, i) => {
              if (b.type === "h2")
                return (
                  <h2 key={i} id={b.id}>
                    {b.text}
                  </h2>
                );
              if (b.type === "quote")
                return (
                  <blockquote key={i} className="my-10 border-l-2 border-neon-cyan pl-6 font-display text-2xl leading-snug text-ink md:text-3xl">
                    {b.text}
                  </blockquote>
                );
              if (b.type === "image")
                return (
                  <figure key={i} className="my-10">
                    <div className="media-frame aspect-[16/9] border hairline">
                      <PlaceholderImage src={b.src} alt={b.caption} hue={post.hue + 40} label="[ARTICLE IMAGE]" />
                    </div>
                    <figcaption className="mt-3 font-mono text-xs tracking-[0.15em] text-dim">{b.caption}</figcaption>
                  </figure>
                );
              return <p key={i}>{b.text}</p>;
            })}

            <div className="mt-12 flex flex-wrap gap-2 border-t hairline pt-8">
              {post.tags.map((t) => (
                <span key={t} className="border hairline px-3 py-1 font-mono text-[0.68rem] uppercase tracking-widest text-mute">
                  # {t.replace(/[\[\]]/g, "")}
                </span>
              ))}
            </div>
          </div>
        </div>

        <nav aria-label="Adjacent articles" className="mt-24 grid gap-px border hairline bg-white/[0.06] md:grid-cols-2">
          {[
            { p: prev, dir: "PREVIOUS", icon: <ArrowLeft size={16} />, align: "text-left" },
            { p: next, dir: "NEXT", icon: <ArrowRight size={16} />, align: "md:text-right" },
          ].map(({ p, dir, icon, align }) =>
            p ? (
              <Link key={dir} href={`/blog/${p.slug}`} className={`group bg-void/90 p-8 transition-colors hover:bg-night ${align}`}>
                <p className={`label mb-3 flex items-center gap-2 ${dir === "NEXT" ? "md:justify-end" : ""}`}>
                  {dir === "PREVIOUS" && icon} {dir} {dir === "NEXT" && icon}
                </p>
                <p className="display text-2xl transition-colors group-hover:text-neon-cyan">{p.title}</p>
              </Link>
            ) : (
              <div key={dir} className={`bg-void/90 p-8 opacity-40 ${align}`}>
                <p className="label">{dir}</p>
                <p className="display mt-3 text-2xl text-dim">—</p>
              </div>
            ),
          )}
        </nav>
      </div>
    </article>
  );
}
