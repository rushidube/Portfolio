import { motion } from "motion/react";
import {
  VIEWPORT,
  fadeUp,
  makeStagger,
  underlineGrow,
} from "../../lib/animations";
import AnimatedText from "./AnimatedText";

const headerStagger = makeStagger(0.08, 0);

/**
 * Shared section heading (title + rule + subtitle).
 *
 * Every section previously repeated this markup by hand; extracting it means
 * the reveal timing is identical everywhere, which is what makes the page feel
 * like one coherent document rather than eight separate ones.
 *
 * The accent rule under the title used to be a `::after` pseudo-element, which
 * cannot be animated by Motion. It is now a real span with the same styling so
 * it can grow out from the left as the title lands.
 */
export default function SectionHeader({ title, subtitle }) {
  return (
    <motion.div
      className="section-header"
      variants={headerStagger}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <h2 className="section-title">
        {/* The wrapper above owns the viewport trigger, so the words simply
            follow whichever state it is in. */}
        <AnimatedText as="span" text={title} trigger="inherit" />
        <motion.span className="section-title-underline" variants={underlineGrow} />
      </h2>

      {subtitle ? (
        <motion.p className="section-subtitle" variants={fadeUp}>
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
