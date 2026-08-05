import { motion } from "motion/react";
import { VIEWPORT, textReveal, textRevealContainer } from "../../lib/animations";

/**
 * Word-by-word heading reveal.
 *
 * Each word rises out of a small blur, one after another. Words - not letters -
 * because letter-level staggering on a real heading reads as noise and creates
 * a lot of DOM nodes for very little payoff.
 *
 * The whole string is exposed to assistive tech via `aria-label` and the
 * decorative word spans are hidden, so the reveal never costs accessibility.
 *
 * @param trigger  "viewport" reveals on scroll, "mount" reveals immediately,
 *                 "inherit" leaves the play state to the nearest motion parent
 *                 (used inside SectionHeader, where the wrapper owns the
 *                 viewport trigger for the whole heading block).
 * @param highlight  Word to wrap in `highlightClass`, e.g. the accent colour.
 */
export default function AnimatedText({
  as = "span",
  text,
  className,
  highlight,
  highlightClass = "accent",
  trigger = "viewport",
  ...rest
}) {
  const Tag = motion[as];
  const words = text.split(" ");

  const triggerProps =
    trigger === "viewport"
      ? { initial: "hidden", whileInView: "visible", viewport: VIEWPORT }
      : trigger === "mount"
        ? { initial: "hidden", animate: "visible" }
        : {};

  return (
    <Tag className={className} aria-label={text} variants={textRevealContainer} {...triggerProps} {...rest}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          variants={textReveal}
          className={highlight !== undefined && word === highlight ? highlightClass : undefined}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {index === words.length - 1 ? word : `${word} `}
        </motion.span>
      ))}
    </Tag>
  );
}
