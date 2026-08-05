import { useEffect } from "react";
import { motion } from "motion/react";
import { DURATION, EASE, curtain } from "../../lib/animations";

/** Never hold the page longer than this, even if assets are still streaming. */
const MAX_MS = 1000;
/** Below this the curtain flashes and reads as a glitch rather than an intro. */
const MIN_MS = 620;

/**
 * Brief branded curtain over the first paint.
 *
 * It exists to hide the moment where fonts settle and the hero image decodes,
 * and to give the page a deliberate "opening" beat. It is strictly time-boxed:
 * whichever happens first, `load` or 1s, the curtain lifts. Content underneath
 * is already in the DOM the whole time, so nothing is hidden from crawlers or
 * screen readers.
 */
export default function Preloader({ onDone }) {
  useEffect(() => {
    const start = performance.now();
    let minTimer = 0;

    const finish = () => {
      const elapsed = performance.now() - start;
      minTimer = window.setTimeout(onDone, Math.max(0, MIN_MS - elapsed));
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    // Hard cap so a slow third-party asset can never trap the visitor.
    const capTimer = window.setTimeout(onDone, MAX_MS);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(minTimer);
      window.clearTimeout(capTimer);
    };
  }, [onDone]);

  return (
    <motion.div
      className="preloader"
      variants={curtain}
      initial="visible"
      exit="exit"
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="preloader-brand">
        <motion.span
          className="logo-dot"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: DURATION.base, ease: EASE }}
        />
        <motion.span
          className="preloader-name"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, ease: EASE, delay: 0.08 }}
        >
          Rushikesh
        </motion.span>
      </div>

      <div className="preloader-track">
        <motion.div
          className="preloader-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: MAX_MS / 1000, ease: EASE }}
        />
      </div>
    </motion.div>
  );
}
