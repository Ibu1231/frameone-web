import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WhoWeAre from "@/components/WhoWeAre";
import Collage from "@/components/Collage";
import Showcase from "@/components/Showcase";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ScrollChoreography from "@/components/ScrollChoreography";
import SmoothScroll from "@/components/SmoothScroll";
import { showcases, studio } from "@/lib/content";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <ScrollChoreography />

      <main id="top">
        {/* The visible headline is decorative (split across masked
            spans), so the document's real h1 lives here. */}
        <h1 className="srOnly">
          {studio.legalName} — media production, {studio.location}
        </h1>

        <Hero />
        <WhoWeAre />
        <Collage />

        {showcases.map((data) => (
          <Showcase key={data.categorySlug} data={data} total={showcases.length} />
        ))}

        <Projects />
        <Contact />
      </main>
    </>
  );
}
