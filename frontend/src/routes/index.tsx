import { createFileRoute } from "@tanstack/react-router";

import { Categories } from "@/components/site/Categories";
import { FeaturedCollection } from "@/components/site/FeaturedCollection";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Instagram } from "@/components/site/Instagram";
import { LimitedOffer } from "@/components/site/LimitedOffer";
import { Nav } from "@/components/site/Nav";
import { Newsletter } from "@/components/site/Newsletter";
import { Process } from "@/components/site/Process";
import { Reviews } from "@/components/site/Reviews";
import { Story } from "@/components/site/Story";
import { Trust } from "@/components/site/Trust";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sam Enterprises" },
      { name: "description", content: "Handmade heritage pickles, delivered pan India with premium packaging and a brand experience crafted for modern food lovers." },
      { property: "og:title", content: "Aamras & Co. — Heritage Pickles" },
      { property: "og:description", content: "Handmade heritage pickles, delivered pan India with premium packaging and a brand experience crafted for modern food lovers." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="pt-28">
        <Hero />
        <FeaturedCollection />
        <Categories />
        <LimitedOffer />
        <Story />
        <Process />
        <Reviews />
        <Trust />
        <Instagram />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
