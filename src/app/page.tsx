import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Education from '@/sections/Education'
import Skills from '@/sections/Skills'
import UXUIDesign from '@/sections/UXUIDesign'
import GitHub from '@/sections/GitHub'
import Experience from '@/sections/Experience'
import Contact from '@/sections/Contact'

export default function Home() {
  return (
    <main className="min-h-screen">
      <section id="hero">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="education">
        <Education />
      </section>
      <section id="skills">
        <Skills />
      </section>
      <section id="design">
        <UXUIDesign />
      </section>
      <section id="github">
        <GitHub />
      </section>
      <section id="experience">
        <Experience />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </main>
  )
}