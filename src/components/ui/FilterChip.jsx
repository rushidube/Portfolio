import { motion } from "motion/react";
import { TAP, pillLift } from "../../lib/animations";

/**
 * Toggleable category pill, shared by every section with a filter row
 * (Projects, Certifications). Previously duplicated verbatim in both.
 */
export default function FilterChip({ label, active, onClick }) {
  return (
    <motion.button
      type="button"
      className={`filter-chip${active ? " active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
      whileHover={pillLift}
      whileTap={TAP}
    >
      {label}
    </motion.button>
  );
}
