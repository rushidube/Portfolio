import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";

import {
  DURATION,
  EASE,
  SPRING,
  drawer,
  iconHover,
  listReveal,
  makeStagger,
} from "../lib/animations";
import { useActiveSection } from "../hooks/useActiveSection";
import { useIsMobileNav } from "../hooks/useMediaQuery";
import ThemeToggle from "./ui/ThemeToggle";

// Module scope so the array identity is stable across renders - otherwise the
// scroll-spy effect would tear down and rebuild its listeners every render.
const NAV_ITEMS = [
  "home",
  "about",
  "skills",
  "certifications",
  "projects",
  "education",
  "experience",
  "contact",
];

const navStagger = makeStagger(0.05, 0.05);

/**
 * Scroll thresholds for the header's glass state, kept apart on purpose: a
 * single shared value flickers the moment the scroll position settles near
 * it (every tick that crosses back and forth re-triggers the transition).
 * The gap between them is a dead zone the state can rest inside.
 */
const GLASS_ENTER = 32;
const GLASS_EXIT = 12;

export default function Navbar() {
  const active = useActiveSection(NAV_ITEMS);
  const isMobile = useIsMobileNav();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled((prev) => {
      if (!prev && value > GLASS_ENTER) return true;
      if (prev && value < GLASS_EXIT) return false;
      return prev;
    });
  });

  // A drawer left open while the viewport grows past the breakpoint would
  // linger in state and spring back open on the way down again. Adjusting
  // during render (rather than in an effect) means React discards this pass and
  // re-runs it immediately, so the stale state never reaches the DOM.
  const [lastIsMobile, setLastIsMobile] = useState(isMobile);
  if (lastIsMobile !== isMobile) {
    setLastIsMobile(isMobile);
    setOpen(false);
  }

  return (
    <motion.header
      className={`site-header ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: DURATION.slow, ease: EASE, delay: 0.15 }}
    >
      <div className="container nav-container">
        <motion.a
          href="#home"
          className="logo"
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <motion.span className="logo-dot" variants={iconHover} />
          <motion.span
            className="logo-text"
            variants={{ rest: { x: 0 }, hover: { x: 2, transition: SPRING } }}
          >
            Rushikesh
          </motion.span>
        </motion.a>

        {/*
          Everything on the right of the logo lives in one group so the header
          keeps its original two-ends layout: adding the theme control as a
          third top-level item would have re-centred the nav links.
        */}
        <div className="nav-actions">
          {isMobile ? (
            <AnimatePresence initial={false}>
              {open ? (
                <motion.nav
                  id="primary-navigation"
                  className="site-nav open"
                  variants={drawer}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <NavLinks active={active} onNavigate={() => setOpen(false)} />

                  {/* Inside the drawer the control gets a label, since there is
                      room for one and it removes any guesswork. */}
                  <motion.div className="nav-theme-row" variants={listReveal}>
                    <span className="nav-theme-label">Theme</span>
                    <ThemeToggle layoutId="theme-thumb-mobile" />
                  </motion.div>
                </motion.nav>
              ) : null}
            </AnimatePresence>
          ) : (
            <nav id="primary-navigation" className="site-nav">
              <NavLinks active={active} onNavigate={() => setOpen(false)} />
            </nav>
          )}

          {!isMobile ? <ThemeToggle layoutId="theme-thumb-desktop" /> : null}

          <button
            className="nav-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="primary-navigation"
          >
            {/*
              Two bars morph into a cross: each rotates 45 degrees in opposite
              directions while sliding to the vertical centre of the pair.
            */}
            <motion.span
              className="nav-toggle-line"
              animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={SPRING}
            />
            <motion.span
              className="nav-toggle-line"
              animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              transition={SPRING}
            />
          </button>
        </div>
      </div>
    </motion.header>
  );
}

/**
 * The link list, shared by the desktop bar and the mobile drawer so both stay
 * in sync by construction.
 *
 * The active underline is a single element with a `layoutId`: Motion animates
 * it from the previously active link to the new one instead of fading two
 * separate underlines, which is what makes section changes feel connected.
 */
function NavLinks({ active, onNavigate }) {
  return (
    <motion.ul
      className="nav-links"
      variants={navStagger}
      initial="hidden"
      animate="visible"
    >
      {NAV_ITEMS.map((item) => (
        <motion.li key={item} variants={listReveal}>
          <a
            href={`#${item}`}
            className={`nav-link ${active === item ? "active" : ""}`}
            onClick={onNavigate}
            aria-current={active === item ? "page" : undefined}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
            {active === item ? (
              <motion.span
                className="nav-underline"
                layoutId="nav-underline"
                transition={SPRING}
              />
            ) : null}
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}
