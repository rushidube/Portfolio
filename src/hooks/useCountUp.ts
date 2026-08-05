import { useEffect, useState } from "react";
import { animate } from "motion/react";
import { DURATION, EASE } from "../lib/animations";

/**
 * Counts 0 -> `value` once `play` becomes true; returns `value` directly
 * without animating while `play` is false, so a caller can gate this on
 * reduced motion (or "not visible yet") just by AND-ing it into `play`
 * before passing it in.
 *
 * Shared by every KPI count-up on the site (Hero snapshot stats,
 * Certification stats) so they all move at the same speed.
 */
export function useCountUp(value: number, play: boolean, duration: number = DURATION.counter): number {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!play) return undefined;

    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [play, value, duration]);

  return play ? display : value;
}
