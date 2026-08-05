import type { PointerEvent as ReactPointerEvent } from "react";
import { useMotionValue, useSpring } from "motion/react";
import type { MotionValue } from "motion/react";
import { SPRING_SOFT } from "../lib/animations";

interface MagneticOptions {
  /** How far the element may travel towards the pointer, in pixels. */
  strength?: number;
  disabled?: boolean;
}

interface Magnetic {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}

/**
 * Very subtle magnetic pull towards the pointer.
 *
 * Offset is a fraction of the distance from the element's centre and capped by
 * `strength`, so a button never detaches from its layout slot - it just leans.
 * Springs handle the return so releasing feels elastic rather than abrupt.
 */
export function useMagnetic({
  strength = 6,
  disabled = false,
}: MagneticOptions = {}): Magnetic {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const x = useSpring(mx, SPRING_SOFT);
  const y = useSpring(my, SPRING_SOFT);

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);

    // Normalise by half-size so the pull maxes out at the element's edge.
    mx.set(clamp((offsetX / (rect.width / 2)) * strength, strength));
    my.set(clamp((offsetY / (rect.height / 2)) * strength, strength));
  };

  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return { x, y, onPointerMove, onPointerLeave };
}

function clamp(value: number, limit: number): number {
  return Math.min(Math.max(value, -limit), limit);
}
