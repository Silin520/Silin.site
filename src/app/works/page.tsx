import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { WorksExplorer } from "@/components/works/WorksExplorer";
import { workCategories, works } from "@/data/works";
import { pageIntro } from "@/data/site";

export const metadata: Metadata = { title: "Selected Works" };

export default function WorksPage() {
  return (
    <>
      <PageHero
        index="W/02"
        eyebrow="PROJECTS / EXPERIMENTS"
        title="SELECTED WORKS"
        subtitle={pageIntro.works}
        tone="cyan"
        aside={<p className="pixel text-xs text-neon-violet">PROJECTS [{String(works.length).padStart(2, "0")}]</p>}
      />
      <WorksExplorer works={works} categories={workCategories} />
    </>
  );
}
