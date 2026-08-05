import { motion } from "motion/react";
import { EASE } from "../../lib/animations";

/**
 * Points loosely tracing the chart line - a scatter-plot reading of it.
 *
 * Kept inside the top ~35% of the viewBox on purpose: the hero's own
 * `padding-top` already reserves that band as empty space above the
 * kicker/avatar, so the artwork lives somewhere real content never reaches
 * instead of relying on the mask alone.
 */
const SCATTER_POINTS = [
  { x: 120, y: 192, delay: 0 },
  { x: 268, y: 158, delay: 0.6 },
  { x: 412, y: 186, delay: 1.1 },
  { x: 566, y: 128, delay: 0.3 },
  { x: 708, y: 144, delay: 1.6 },
  { x: 862, y: 92, delay: 0.9 },
  { x: 1004, y: 104, delay: 1.9 },
  { x: 1128, y: 70, delay: 0.4 },
];

/** Fixed positions, biased to the corners/edges - the content lives in the
    middle, so the particles stay out of it. */
const PARTICLES = [
  { top: "10%", left: "6%", size: 3, duration: 9, delay: 0 },
  { top: "85%", left: "10%", size: 2, duration: 11, delay: 1.2 },
  { top: "14%", left: "90%", size: 3, duration: 10, delay: 0.6 },
  { top: "88%", left: "86%", size: 2, duration: 12, delay: 2 },
  { top: "8%", left: "45%", size: 2, duration: 13, delay: 0.8 },
  { top: "6%", left: "65%", size: 2, duration: 10, delay: 1.6 },
];

/**
 * Decorative, hero-scoped backdrop: a faint grid, a hand-drawn chart line with
 * scatter points, one soft analytics glow, and a handful of drifting
 * particles - enough to read as "data" at a glance without competing with the
 * copy. Entirely aria-hidden and pointer-events: none.
 *
 * Two layers of protection keep it from ever reading as clutter behind the
 * headline/buttons: the line and points are drawn only in the top band of the
 * viewBox (geometry), and `.hero-backdrop`'s CSS mask fades the whole layer
 * out again over the content's footprint (belt and suspenders) - on top of
 * which the line itself sits at 10-15% opacity, so even where the two don't
 * line up perfectly there is nothing left to compete with the text.
 *
 * The glow's pulse is a plain CSS keyframe, so it is already covered by the
 * site-wide `prefers-reduced-motion` block. The scatter points and particles
 * are Motion-driven per-item loops, so - matching the pattern in
 * AnimatedBackground - they are gated here explicitly.
 */
export default function HeroDataBackdrop({ reduceMotion }) {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <div className="hero-glow" />

      <svg
        className="hero-data-svg"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" className="hero-grid-line" />
          </pattern>
          <linearGradient id="heroLineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--brand-cyan)" />
            <stop offset="100%" stopColor="var(--brand-blue)" />
          </linearGradient>
        </defs>

        <rect width="1200" height="600" fill="url(#heroGrid)" className="hero-grid-fill" />

        <motion.path
          d="M60,200 C220,150 300,230 430,150 S620,90 760,120 S940,60 1140,90"
          fill="none"
          stroke="url(#heroLineGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="hero-chart-line"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.13 }}
          transition={{ duration: 2.2, ease: EASE, delay: 0.5 }}
        />

        {SCATTER_POINTS.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={3.5}
            className="hero-scatter-point"
            animate={reduceMotion ? { opacity: 0.12 } : { opacity: [0.08, 0.18, 0.08] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: point.delay }
            }
          />
        ))}
      </svg>

      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          className="hero-particle"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          animate={reduceMotion ? undefined : { y: [0, -14, 0], opacity: [0.08, 0.22, 0.08] }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
