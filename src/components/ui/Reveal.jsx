import { useMemo } from "react";
import { motion } from "motion/react";
import { VIEWPORT, fadeUp, withDelay } from "../../lib/animations";

/**
 * Scroll-reveal wrapper used across every section.
 *
 * Centralising this means a single place controls the viewport threshold and
 * the "animate once" rule, and section components stay readable - they declare
 * *what* reveals, not *how*.
 *
 * Renders as a plain `div` by default; pass `as` for semantic elements.
 */
export default function Reveal({
  as = "div",
  variants = fadeUp,
  delay = 0,
  amount,
  className,
  children,
  ...rest
}) {
  const Tag = motion[as];

  // Delay has to live inside the variant - see withDelay for why.
  const resolved = useMemo(() => withDelay(variants, delay), [variants, delay]);
  const viewport = useMemo(
    () => (amount === undefined ? VIEWPORT : { ...VIEWPORT, amount }),
    [amount],
  );

  return (
    <Tag
      className={className}
      variants={resolved}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      {...rest}
    >
      {children}
    </Tag>
  );
}
