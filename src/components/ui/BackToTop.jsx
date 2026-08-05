import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp } from "lucide-react";
import { SPRING, TAP, iconHover, pillLift } from "../../lib/animations";

/** Roughly one viewport down - far enough that returning to top is a real cost. */
const SHOW_AFTER = 600;

/**
 * Floating "back to top" control.
 *
 * Visibility is driven by a motion value subscription rather than a scroll
 * listener plus state, so React only re-renders on the two frames where the
 * button actually crosses the threshold.
 */
export default function BackToTop() {
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > SHOW_AFTER;
    if (next !== shown) setShown(next);
  });

  return (
    <AnimatePresence>
      {shown ? (
        <motion.button
          type="button"
          className="back-to-top"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={SPRING}
          whileHover={pillLift}
          whileTap={TAP}
        >
          <motion.span variants={iconHover} initial="rest" whileHover="hover">
            <ArrowUp size={18} aria-hidden="true" />
          </motion.span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
