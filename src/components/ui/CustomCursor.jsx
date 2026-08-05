import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useFinePointer } from "../../hooks/useMediaQuery";

/** Anything that should make the ring expand. */
const INTERACTIVE = 'a, button, input, textarea, select, [data-cursor="hover"]';

/**
 * Two-part cursor: a dot that tracks the pointer exactly and a ring that
 * trails it on a spring, expanding over anything interactive.
 *
 * Desktop only. It never renders on touch devices or when the visitor has asked
 * for reduced motion, and the native cursor is only hidden once this component
 * has actually mounted - so if the JS never runs, the normal cursor stays.
 */
export default function CustomCursor() {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const enabled = finePointer && !reduceMotion;

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  // Raw pointer position. The dot reads it directly; the ring lags behind it.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return undefined;

    const onMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };

    // Delegated so cards and links added later are covered automatically.
    const onOver = (event) => {
      setHovering(Boolean(event.target.closest?.(INTERACTIVE)));
    };

    // `mouseleave` on the root element is the reliable "pointer left the
    // window" signal; pointerleave on `document` does not fire consistently.
    const onLeave = () => setVisible(false);
    const root = document.documentElement;

    root.classList.add("has-custom-cursor");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("blur", onLeave);
    root.addEventListener("mouseleave", onLeave);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("blur", onLeave);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="app-cursor app-cursor-dot"
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 0.4 : 1 }}
        transition={{ duration: 0.18 }}
        aria-hidden="true"
      >
        <span />
      </motion.div>

      <motion.div
        className="app-cursor app-cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 1.8 : 1 }}
        transition={{ duration: 0.22 }}
        aria-hidden="true"
      >
        <span />
      </motion.div>
    </>
  );
}
