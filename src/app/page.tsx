import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection, GalleryPreviewSection, GuestbookCTA, LatestJournalSection, Marquee, SelectedWorksSection } from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Marquee />
      <AboutSection />
      <SelectedWorksSection />
      <LatestJournalSection />
      <GalleryPreviewSection />
      <GuestbookCTA />
    </>
  );
}
