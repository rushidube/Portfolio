import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Certifications from "./components/Certifications";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import AnimatedBackground from "./components/ui/AnimatedBackground";
import BackToTop from "./components/ui/BackToTop";
import CustomCursor from "./components/ui/CustomCursor";
import Preloader from "./components/ui/Preloader";
import ScrollProgress from "./components/ui/ScrollProgress";
import ToastViewport from "./components/ui/ToastViewport";
import { pageEnter } from "./lib/animations";
import { ThemeProvider } from "./lib/theme";
import { ToastProvider } from "./lib/toast";

function App() {
  const [loading, setLoading] = useState(true);
  const handleLoaded = useCallback(() => setLoading(false), []);

  // Freeze scrolling behind the curtain so the page cannot be scrolled to a
  // random offset before its entrance animation has run.
  useEffect(() => {
    document.body.classList.toggle("is-loading", loading);
    return () => document.body.classList.remove("is-loading");
  }, [loading]);

  // A deep link (e.g. `/#projects`) relies on the browser's own hash-scroll,
  // which races against the `overflow: hidden` lock above - on a slow paint it
  // can lose, leaving the visitor at the top once the curtain lifts. Re-asserting
  // the target here is a no-op when the native scroll already won, and a fix
  // when it did not; either way it happens while the curtain still fully covers
  // the page, so it is never seen as a jump.
  useEffect(() => {
    if (loading) return;
    const hash = window.location.hash;
    if (!hash) return;

    let target;
    try {
      target = document.querySelector(hash);
    } catch {
      return;
    }
    target?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [loading]);

  return (
    /*
     * `reducedMotion="user"` is the single accessibility switch for the whole
     * site: when the OS asks for reduced motion, Motion drops every transform
     * and layout animation and keeps only opacity, without any component
     * needing to know about it. Continuous decorative loops opt out separately
     * via useReducedMotion.
     */
    <ThemeProvider>
      <ToastProvider>
        <MotionConfig reducedMotion="user">
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <AnimatePresence>
            {loading ? <Preloader key="preloader" onDone={handleLoaded} /> : null}
          </AnimatePresence>

          <AnimatedBackground />
          <CustomCursor />
          <ScrollProgress />

          <Navbar />

          <motion.main
            id="main-content"
            variants={pageEnter}
            initial="pageHidden"
            animate={loading ? "pageHidden" : "pageVisible"}
          >
            {/* The hero is above the fold, so it waits for the curtain instead of
                a viewport trigger that would fire while it is still covered. */}
            <Hero ready={!loading} />
            <About />
            <Skills />
            <Certifications />
            <Projects />
            <Education />
            <Experience />
            <Contact />
          </motion.main>

          <Footer />
          <BackToTop />
          <ToastViewport />
        </MotionConfig>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
