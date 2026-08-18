import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Collage from "@/components/Collage";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import SmoothScroll from "@/components/SmoothScroll";
import { studio } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Intro />
      <SmoothScroll />
      <Nav />

      <main id="top">
        {/* The visible headline is decorative (split across masked
            spans), so the document's real h1 lives here. */}
        <h1 className="srOnly">
          {studio.legalName} — media production, {studio.location}
        </h1>

        <Hero />
        <Collage />

        <Projects />
        <Contact />
      </main>
    </>
  );
}
