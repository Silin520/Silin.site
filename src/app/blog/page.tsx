import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { blogCategories, blogPosts } from "@/data/blog";
import { pageIntro } from "@/data/site";

export const metadata: Metadata = { title: "Journal" };

export default function BlogPage() {
  const featured = blogPosts[0];
  return (
    <>
      <PageHero index="B/01" eyebrow="NOTES / JOURNAL" title="JOURNAL" subtitle={pageIntro.blog} tone="violet" aside={<p className="label">{String(blogPosts.length).padStart(2, "0")} ENTRIES</p>} />
      <section className="wrap" aria-label="Featured article">
        <ArticleCard post={featured} index={0} variant="feature" />
      </section>
      <BlogExplorer posts={blogPosts} categories={blogCategories} />
    </>
  );
}
