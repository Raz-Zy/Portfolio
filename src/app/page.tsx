import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Education from '@/sections/Education'
import Skills from '@/sections/Skills'
import AXTransformation from '@/sections/AXTransformation'
import UXUIDesign from '@/sections/UXUIDesign'
import GitHub from '@/sections/GitHub'
import Experience from '@/sections/Experience'
import ScrollSection from '@/components/ScrollSection'
import CosmicBackground from '@/components/CosmicBackground'
import Footer from '@/components/Footer'

// ScrollSection adds scroll-linked parallax/fade. It must wrap INSIDE the
// <section id> elements (ids stay untransformed for anchors + scroll-spy).
// Not wrapped: hero (scrubs itself), skills, ax, design, and experience
// (transform would break their position: sticky pinned stacks/decks),
// contact (the Footer — it doubles as the contact section, so #contact
// anchors land on it, and its action bar scrubs its own reveal).
//
// CosmicBackground is fixed to the viewport behind everything; sections
// without their own background (hero, education, design, experience,
// contact) let it show through while scrolling.
export default function Home() {
  return (
    <main className="min-h-screen">
      <CosmicBackground />
      <div className="relative z-10">
        <section id="hero">
          <Hero />
        </section>
        <section id="about">
          <ScrollSection>
            <About />
          </ScrollSection>
        </section>
        <section id="education">
          <ScrollSection>
            <Education />
          </ScrollSection>
        </section>
        <section id="skills">
          <Skills />
        </section>
        <section id="ax">
          <AXTransformation />
        </section>
        <section id="design">
          <UXUIDesign />
        </section>
        <section id="github">
          <ScrollSection>
            <GitHub />
          </ScrollSection>
        </section>
        <section id="experience">
          <Experience />
        </section>
        <section id="contact">
          <Footer />
        </section>
      </div>
    </main>
  )
}
