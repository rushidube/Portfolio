import { motion, useScroll, useSpring } from "motion/react";

/**
 * Hairline reading-progress bar pinned under the header.
 *
 * `useScroll` writes straight to a motion value, so this never triggers a React
 * render while scrolling. The spring keeps the bar from twitching on trackpads
 * with momentum, and `restDelta` lets it settle instead of animating forever.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}
