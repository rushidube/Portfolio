import type { PointerEvent as ReactPointerEvent } from "react";
import { useMotionValue, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { SPRING_SOFT } from "../lib/animations";

interface TiltOptions {
  /** Maximum rotation in degrees at the card's corners. */
  max?: number;
  /** Skip all pointer maths (touch devices, reduced motion). */
  disabled?: boolean;
}

interface Tilt {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  /** Normalised pointer position, for driving a glare/highlight layer. */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}

/**
 * Subtle 3D tilt driven by pointer position within an element.
 *
 * The raw pointer offset is normalised to -0.5..0.5 and pushed through a soft
 * spring, so the card trails the cursor instead of snapping to it. Rotation is
 * capped at a few degrees on purpose - anything more looks like a gimmick.
 */
export function useTilt({ max = 6, disabled = false }: TiltOptions = {}): Tilt {
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const sx = useSpring(px, SPRING_SOFT);
  const sy = useSpring(py, SPRING_SOFT);

  // Pointer right -> rotate around Y; pointer down -> rotate around X (inverted
  // so the card appears to tip towards the cursor).
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return { rotateX, rotateY, pointerX: sx, pointerY: sy, onPointerMove, onPointerLeave };
}
