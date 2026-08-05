import { motion } from "motion/react";

/**
 * Shared "nothing matches" panel for any filterable list on the site
 * (project search, certification filters, ...). One component means every
 * empty result reads the same way instead of each section inventing its own.
 */
export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="empty-state-icon">
        <Icon size={26} aria-hidden="true" />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
      {action ? (
        <button type="button" className="btn btn-ghost btn-sm" onClick={action.onClick}>
          {action.icon ? <action.icon size={14} aria-hidden="true" /> : null}
          {action.label}
        </button>
      ) : null}
    </motion.div>
  );
}
