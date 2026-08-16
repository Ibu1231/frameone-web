import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import WorkPanel from "@/components/WorkPanel";
import Reel from "@/components/Reel";
import Disciplines from "@/components/Disciplines";
import Contact from "@/components/Contact";
import ScrollChoreography from "@/components/ScrollChoreography";
import { projects, statement, studio, workIntro } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Nav />
      <ScrollChoreography />

      <main id="top">
        {/* The visible headline is decorative (split across masked
            spans), so the document's real h1 lives here. */}
        <h1 className="srOnly">
          {studio.legalName} — media production, {studio.location}
        </h1>

        <Hero />

        <Statement
          label={statement.label}
          heading={statement.heading}
          columns={statement.columns}
          height="180svh"
        />

        <Statement
          id="work"
          label={workIntro.label}
          heading={workIntro.heading}
          columns={[workIntro.body]}
          height="150svh"
          dark
        />

        {projects.map((project, i) => (
          <WorkPanel
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
          />
        ))}

        <Reel />
        <Disciplines />
        <Contact />
      </main>
    </>
  );
}
