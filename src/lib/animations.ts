/**
 * Central motion language for the portfolio.
 *
 * Everything animated on this site pulls its timing, easing and distance from
 * this file so the whole experience feels like one system rather than a set of
 * unrelated effects. Components should import variants from here instead of
 * writing inline animation objects.
 *
 * Rules of the system:
 *  - Short travel distances (14-28px). Motion should be felt, not watched.
 *  - One shared easing curve for entrances, one shared spring for interactions.
 *  - Entrances run once, on scroll. Only decorative layers loop forever.
 */

import type { TargetAndTransition, Transition, Variants } from "motion/react";

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */

/** Soft "expo out" curve: fast start, long elegant settle. Used for entrances. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Symmetric curve for state changes that go both ways (menus, toggles). */
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DURATION = {
  fast: 0.25,
  base: 0.55,
  slow: 0.8,
  /** Shared length for every KPI count-up (Hero snapshot stats, Certification stats). */
  counter: 1.5,
} as const;

/** Distance tokens. Kept small on purpose - premium motion is restrained. */
export const DISTANCE = {
  sm: 14,
  md: 22,
  lg: 28,
} as const;

/** Interactive spring for hover / tap / cursor. No overshoot wobble. */
export const SPRING: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.7,
};

/** Softer, heavier spring for elements that trail the pointer. */
export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 22,
  mass: 0.9,
};

/** Standard entrance transition. */
export const ENTER: Transition = {
  duration: DURATION.base,
  ease: EASE,
};

/**
 * Shared viewport config: reveal once, when a quarter of the element is in
 * view. `once` is what keeps scrolling cheap - no observer churn on re-entry.
 */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

/** Looser threshold for tall blocks that never reach 25% on small screens. */
export const VIEWPORT_LOOSE = { once: true, amount: 0.15 } as const;

/* ------------------------------------------------------------------ */
/* Directional fades                                                   */
/* ------------------------------------------------------------------ */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: DISTANCE.md },
  visible: { opacity: 1, y: 0, transition: ENTER },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: DISTANCE.lg },
  visible: { opacity: 1, x: 0, transition: ENTER },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: -DISTANCE.lg },
  visible: { opacity: 1, x: 0, transition: ENTER },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: ENTER },
};

/* ------------------------------------------------------------------ */
/* Scale                                                               */
/* ------------------------------------------------------------------ */

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: DISTANCE.sm },
  visible: { opacity: 1, scale: 1, y: 0, transition: ENTER },
};

/* ------------------------------------------------------------------ */
/* Blur + text                                                         */
/* ------------------------------------------------------------------ */

/**
 * Blur reveals read as "coming into focus". Blur is the most expensive thing
 * we animate, so it is reserved for a handful of headline elements and kept
 * to a small radius over a short window.
 */
export const blurReveal: Variants = {
  hidden: { opacity: 0, y: DISTANCE.sm, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

/** Per-word/letter unit used inside `textRevealContainer`. */
export const textReveal: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: DURATION.base, ease: EASE },
  },
};

/** Parent for word-by-word headline reveals. */
export const textRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

/* ------------------------------------------------------------------ */
/* Stagger                                                             */
/* ------------------------------------------------------------------ */

/** Default parent: children animate 80ms apart after a 100ms lead-in. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/** Tunable version of the above. */
export const makeStagger = (stagger = 0.08, delay = 0.1): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Vertical list items (nav links, timeline rows). Slightly shorter travel. */
export const listReveal: Variants = {
  hidden: { opacity: 0, y: DISTANCE.sm },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/* Composite section / card / image variants                           */
/* ------------------------------------------------------------------ */

/** Cards get a touch of scale so they feel like they settle onto the page. */
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: DISTANCE.lg, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

/** Images/avatars: unblur + settle, longer window so it reads as deliberate. */
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

/** Section-title underline: grows from the left as the heading lands. */
export const underlineGrow: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE, delay: 0.15 },
  },
};

/**
 * Returns a copy of `variants` whose `visible` state starts `delay` seconds
 * later.
 *
 * Framer Motion lets a variant's own transition win over the `transition`
 * prop, so a delay passed as a prop next to these variants would be silently
 * dropped. Merging it into the variant is the only reliable way.
 */
export const withDelay = (variants: Variants, delay: number): Variants => {
  const visible = variants.visible;
  if (!delay || typeof visible !== "object" || visible === null) return variants;

  const { transition, ...target } = visible as Record<string, unknown> & {
    transition?: Transition;
  };

  return {
    ...variants,
    visible: { ...target, transition: { ...(transition ?? ENTER), delay } },
  };
};

/* ------------------------------------------------------------------ */
/* Interaction variants (whileHover / whileTap)                        */
/* ------------------------------------------------------------------ */

/**
 * Buttons grow a hair on hover and compress on tap.
 *
 * Scale only, deliberately: MagneticButton drives `y` from motion values (the
 * pointer pull plus a hover lift), and a variant animating the same axis would
 * overwrite that binding. The glow stays in CSS so the visual identity is
 * untouched - Motion only supplies the movement.
 */
export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: SPRING },
  tap: { scale: 0.96, transition: { ...SPRING, stiffness: 500 } },
};

/** How far a button lifts on hover, in pixels. Consumed by MagneticButton. */
export const BUTTON_LIFT = -3;

/**
 * Theme-toggle icons.
 *
 * The selected icon swings in from a slight counter-rotation and settles at
 * full opacity; unselected icons sit back at 60%. The rotation is a keyframe
 * pair so it replays on every selection, while scale and opacity stay on the
 * shared spring - hence the per-property transition.
 */
export const themeIcon: Variants = {
  inactive: { scale: 1, opacity: 0.6, transition: SPRING },
  active: {
    scale: 1.06,
    opacity: 1,
    rotate: [-35, 0],
    transition: { rotate: { duration: 0.5, ease: EASE }, default: SPRING },
  },
};

/** Icons rotate a few degrees rather than spinning - restraint over flash. */
export const iconHover: Variants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: -8, scale: 1.12, transition: SPRING },
  tap: { scale: 0.94, transition: SPRING },
};

/*
 * Hover *targets* rather than variants.
 *
 * An element can only carry one `variants` prop. Cards already spend theirs on
 * a reveal (hidden/visible), so their hover state is expressed as a plain
 * target passed to `whileHover`. These are shared constants for exactly the
 * same reason the variants are: one definition, one feel, no inline objects
 * drifting apart across files.
 */
export const cardLift: TargetAndTransition = { y: -6, transition: SPRING };

export const pillLift: TargetAndTransition = {
  y: -2,
  scale: 1.05,
  transition: SPRING,
};

export const linkNudge: TargetAndTransition = { x: 3, transition: SPRING };

/**
 * Shared press-feedback target for `whileTap`, matching `buttonHover`'s own
 * tap state. Every clickable control on the site compresses by the same
 * amount on press - this is what a one-off `whileTap={{ scale: 0.9x }}`
 * should reach for instead of picking its own number.
 */
export const TAP: TargetAndTransition = { scale: 0.96, transition: { ...SPRING, stiffness: 500 } };

/* ------------------------------------------------------------------ */
/* Overlay / global chrome                                             */
/* ------------------------------------------------------------------ */

/** Preloader curtain lift. */
export const curtain: Variants = {
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    filter: "blur(12px)",
    transition: { duration: 0.5, ease: EASE },
  },
};

/**
 * First paint of the page body once the preloader clears.
 *
 * Opacity only, deliberately. A `transform` or `filter` on a full-page wrapper
 * turns that wrapper into the containing block for `position: fixed` children,
 * which would detach the navbar from the viewport, and a residual blur layer
 * that size is expensive to composite for the rest of the session. The scale
 * and blur that make the entrance feel soft live on the hero's own children,
 * where they are cheap and safe.
 *
 * The state names are intentionally *not* "hidden"/"visible". Motion propagates
 * a parent's variant label to every motion descendant, so reusing those names
 * here would fire every section's scroll reveal the instant the page appeared.
 * Distinct labels let the wrapper animate while its children keep waiting for
 * their own viewport trigger.
 */
export const pageEnter: Variants = {
  pageHidden: { opacity: 0 },
  pageVisible: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE } },
};

/** Mobile menu drawer: animates its own height so layout never jumps. */
export const drawer: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { height: { duration: 0.32, ease: EASE_IN_OUT }, opacity: { duration: 0.2 } },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { height: { duration: 0.26, ease: EASE_IN_OUT }, opacity: { duration: 0.15 } },
  },
};
