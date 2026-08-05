import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useFinePointer } from "../../hooks/useMediaQuery";

/**
 * Depth of each orb's pointer parallax. Negative values drift against the
 * cursor, which is what sells the sense of layers.
 */
const ORBS = [
  { className: "orb-1", depth: 18, duration: 22, drift: -26 },
  { className: "orb-2", depth: -12, duration: 26, drift: 20 },
  { className: "orb-3", depth: 14, duration: 30, drift: -18 },
];

/**
 * Ambient background layer: three slow, heavily-blurred orbs plus a fine noise
 * wash.
 *
 * The orb styles already existed in the stylesheet but were never rendered, so
 * this brings the site's own intended background to life rather than inventing
 * a new one. Everything sits behind the content at low opacity and is
 * `pointer-events: none`, so it can never interfere with reading or clicking.
 *
 * Structure is two nested elements per orb on purpose: the outer one owns the
 * pointer parallax and the inner one owns the endless float. Both effects write
 * to `transform`, so they cannot share an element.
 */
export default function AnimatedBackground() {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const parallaxEnabled = finePointer && !reduceMotion;

  // Pointer position normalised to -0.5..0.5 of the viewport.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 20, mass: 1 });
  const sy = useSpring(py, { stiffness: 40, damping: 20, mass: 1 });

  useEffect(() => {
    if (!parallaxEnabled) return undefined;

    const onMove = (event) => {
      px.set(event.clientX / window.innerWidth - 0.5);
      py.set(event.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [parallaxEnabled, px, py]);

  return (
    <div className="bg-layer" aria-hidden="true">
      {ORBS.map((orb) => (
        <Orb key={orb.className} orb={orb} sx={sx} sy={sy} still={reduceMotion} />
      ))}
      <div className="bg-noise" />
    </div>
  );
}

function Orb({ orb, sx, sy, still }) {
  const x = useTransform(sx, (value) => value * orb.depth);
  const y = useTransform(sy, (value) => value * orb.depth);

  return (
    <motion.div className={`bg-orb ${orb.className}`} style={{ x, y }}>
      <motion.div
        className="bg-orb-inner"
        // Scale + vertical drift only; horizontal movement belongs to parallax.
        animate={
          still
            ? undefined
            : { scale: [1, 1.14, 1], y: [0, orb.drift, 0], opacity: [0.85, 1, 0.85] }
        }
        transition={{
          duration: orb.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
