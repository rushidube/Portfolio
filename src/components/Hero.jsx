import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { FaLinkedin } from "react-icons/fa";
import { BarChart3, Database, FolderCheck, Terminal, UserRound } from "lucide-react";

import {
  blurReveal,
  cardLift,
  fadeUp,
  imageReveal,
  makeStagger,
  pillLift,
  textReveal,
  textRevealContainer,
} from "../lib/animations";
import { useCountUp } from "../hooks/useCountUp";
import { useFinePointer } from "../hooks/useMediaQuery";
import MagneticButton from "./ui/MagneticButton";
import HeroDataBackdrop from "./ui/HeroDataBackdrop";
import LoadableImage from "./ui/LoadableImage";

// Module scope: these never change, and keeping them out of the component body
// stops the typing effect's dependency array from churning every render.
const ROLES = [
  "Data Analyst",
  "Power BI Developer",
  "Business Intelligence Analyst",
  "SQL & Python Analyst",
];

const TECH_PILLS = [
  "SQL",
  "Power BI",
  "Python",
  "Excel",
  "Pandas",
  "NumPy",
  "Data Visualization",
  "Statistics",
];

const SNAPSHOT_STATS = [
  { label: "Dashboards Built", value: 6, suffix: "+", Icon: BarChart3 },
  { label: "Datasets Analyzed", value: 25, suffix: "+", Icon: Database },
  { label: "SQL Queries Written", value: 150, suffix: "+", Icon: Terminal },
  { label: "Projects Completed", value: 10, suffix: "+", Icon: FolderCheck },
];

const TITLE_WORDS = ["I'm", "Rushikesh"];

const heroStagger = makeStagger(0.09, 0.15);
const actionsStagger = makeStagger(0.08, 0.1);
const pillStagger = makeStagger(0.04, 0.1);
const snapshotStagger = makeStagger(0.08, 0.35);

/** How far the avatar leans towards the pointer, in pixels. */
const AVATAR_PARALLAX = 16;

export default function Hero({ ready = true }) {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();

  const { text: typed, roleIndex } = useTypewriter(ROLES, reduceMotion);
  const parallax = useAvatarParallax(finePointer && !reduceMotion);

  // Everything below animates off this one label, so the whole hero lands as a
  // single coordinated sequence the moment the preloader clears.
  const state = ready ? "visible" : "hidden";

  return (
    <section id="home" className="section hero">
      <HeroDataBackdrop reduceMotion={reduceMotion} />

      <div className="container hero-grid">
        {/* LEFT - Avatar */}
        <motion.div
          className="hero-media"
          variants={heroStagger}
          initial="hidden"
          animate={state}
          onPointerMove={parallax.onPointerMove}
          onPointerLeave={parallax.onPointerLeave}
        >
          <motion.div
            className="hero-avatar-parallax"
            style={{ x: parallax.x, y: parallax.y }}
            variants={imageReveal}
          >
            {/* Breathing aura. Sits behind the portrait and only ever changes
                scale/opacity, so it stays on the compositor. */}
            <motion.div
              className="hero-avatar-aura"
              animate={
                reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.45, 0.7, 0.45] }
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="hero-avatar-wrap">
              <div className="hero-avatar-glow"></div>
              <LoadableImage
                src="/myphoto.jpeg"
                alt="Rushikesh Dube"
                className="hero-avatar"
                width="290"
                height="290"
                fetchPriority="high"
                fallbackIcon={UserRound}
              />
            </div>
          </motion.div>

          <motion.div
            className="hero-stack-pills"
            variants={pillStagger}
            initial="hidden"
            animate={state}
          >
            {TECH_PILLS.map((tech) => (
              <motion.span
                key={tech}
                className="hero-stack-pill"
                variants={fadeUp}
                whileHover={pillLift}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT - Text */}
        <motion.div
          className="hero-text"
          variants={heroStagger}
          initial="hidden"
          animate={state}
        >
          <motion.p className="hero-kicker" variants={fadeUp}>
            Data Analyst • Power BI Developer • Business Intelligence
          </motion.p>

          {/* Word-by-word so the name lands last and holds the eye. */}
          <motion.h1
            className="hero-title"
            variants={textRevealContainer}
            aria-label="I'm Rushikesh"
          >
            {TITLE_WORDS.map((word, index) => (
              <motion.span
                key={word}
                aria-hidden="true"
                variants={textReveal}
                className={index === 1 ? "accent shimmer" : undefined}
                style={{ display: "inline-block", whiteSpace: "pre" }}
              >
                {index === TITLE_WORDS.length - 1 ? word : `${word} `}
              </motion.span>
            ))}
          </motion.h1>

          <motion.h2 className="hero-subtitle" variants={fadeUp}>
            {/* aria-live so screen readers announce the role instead of every
                intermediate keystroke of the typing effect. */}
            {reduceMotion ? (
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  className="subtitle-dynamic"
                  aria-live="polite"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {typed}
                </motion.span>
              </AnimatePresence>
            ) : (
              <span className="subtitle-dynamic" aria-live="polite">
                {typed}
              </span>
            )}
            <span className="cursor" aria-hidden="true"></span>
          </motion.h2>

          <motion.p className="hero-description" variants={blurReveal}>
            I help businesses turn raw, messy data into clear, actionable insight - building
            interactive Power BI dashboards, writing efficient SQL queries, and using Python to
            clean, analyze, and visualize data that drives smarter, faster decisions.
          </motion.p>

          <motion.div className="hero-actions" variants={actionsStagger}>
            <motion.span className="hero-action" variants={fadeUp}>
              <MagneticButton href="#projects" className="btn btn-primary">
                View Analytics Projects
              </MagneticButton>
            </motion.span>

            <motion.span className="hero-action" variants={fadeUp}>
              <MagneticButton
                href="/Rushikesh_Dube_CV.pdf"
                className="btn btn-ghost"
                download="Rushikesh_Dube_Resume.pdf"
              >
                Download Resume
              </MagneticButton>
            </motion.span>

            <motion.span className="hero-action" variants={fadeUp}>
              <MagneticButton
                href="https://www.linkedin.com/in/rushikeshkdube/"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
              >
                <FaLinkedin />
              </MagneticButton>
            </motion.span>
          </motion.div>
        </motion.div>
      </div>

      <div className="container">
        <motion.div
          className="hero-snapshot"
          variants={snapshotStagger}
          initial="hidden"
          animate={state}
        >
          {SNAPSHOT_STATS.map((stat) => (
            <SnapshotStat key={stat.label} {...stat} play={ready} reduceMotion={reduceMotion} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * One KPI tile: icon, count-up value, label.
 *
 * Reduced motion skips straight to the final number - a spinning odometer is
 * motion for its own sake, not information.
 */
function SnapshotStat({ label, value, suffix, Icon, play, reduceMotion }) {
  const display = useCountUp(value, play && !reduceMotion);

  return (
    <motion.div className="hero-snapshot-stat" variants={fadeUp} whileHover={cardLift}>
      <span className="hero-snapshot-icon">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="hero-snapshot-value">
        {display}
        {suffix}
      </span>
      <span className="hero-snapshot-label">{label}</span>
    </motion.div>
  );
}

/**
 * Types each role out, pauses, deletes it, moves to the next, forever.
 *
 * Reduced motion still cycles through every role - freezing on the first one
 * forever reads as broken, not restrained - it just swaps the whole word on a
 * timer instead of simulating keystrokes. The caller cross-fades between
 * words (opacity only) rather than animating it here, since a hook has no
 * business returning JSX.
 */
function useTypewriter(roles, reduceMotion) {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Reduced motion: advance the role on a fixed interval, no per-character
  // simulation. Only roleIndex is pushed from here - the displayed word is
  // derived in the return statement, the same way useCountUp derives its
  // reduced-motion value instead of syncing it via a second effect.
  useEffect(() => {
    if (!reduceMotion) return undefined;

    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [reduceMotion, roles.length]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const current = roles[roleIndex];
    let timeout;

    if (!deleting) {
      timeout = setTimeout(() => {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1400);
        }
      }, 80);
    } else {
      timeout = setTimeout(() => {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }, 50);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex, roles, reduceMotion]);

  return { text: reduceMotion ? roles[roleIndex] : text, roleIndex };
}

/**
 * Leans the portrait a few pixels towards the pointer as it crosses the hero.
 *
 * Applied to a wrapper rather than the portrait itself: the portrait keeps its
 * CSS float animation, and stacking the two transforms on one element would
 * make them overwrite each other.
 */
function useAvatarParallax(enabled) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.9 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.9 });

  const x = useTransform(sx, (value) => value * AVATAR_PARALLAX);
  const y = useTransform(sy, (value) => value * AVATAR_PARALLAX);

  return {
    x,
    y,
    onPointerMove: (event) => {
      if (!enabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      px.set((event.clientX - rect.left) / rect.width - 0.5);
      py.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    onPointerLeave: () => {
      px.set(0);
      py.set(0);
    },
  };
}
