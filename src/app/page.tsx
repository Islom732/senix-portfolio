import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { ClickBurst } from "@/components/ClickBurst";
import { Cursor } from "@/components/Cursor";
import { Extras } from "@/components/Extras";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { I18nProvider } from "@/components/I18nProvider";
import { Intro } from "@/components/Intro";
import { Marquee } from "@/components/Marquee";
import { MotionProvider } from "@/components/MotionProvider";
import { Navbar } from "@/components/Navbar";
import { Playground } from "@/components/Playground";
import { Projects } from "@/components/Projects";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Terminal } from "@/components/Terminal";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function Home() {
  return (
    <ThemeProvider>
    <I18nProvider>
    <MotionProvider>
      <SmoothScroll />
      <Extras />
      <Intro />
      <Cursor />
      <ClickBurst />
      <ScrollProgress />
      <Navbar />
      <Terminal />
      <main id="main" className="flex-1">
        <Hero />
        <Marquee />
        <Projects />
        <Playground />
        <About />
        <Contact />
      </main>
      <Footer />
    </MotionProvider>
    </I18nProvider>
    </ThemeProvider>
  );
}
