import { motion } from "motion/react";
import { BadgeCheck, Sparkles } from "lucide-react";

import { EASE, cardLift, cardReveal, iconHover, listReveal, makeStagger } from "../lib/animations";
import { CAPABILITIES, SKILL_GROUPS } from "../data/skills";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

const groupStagger = makeStagger(0.1, 0.05);
// Skill tiles are numerous per group, so they get a tight stagger of their own,
// nested inside the group's own entrance - see SkillCard for how the bar fill
// piggybacks on this same "visible" state instead of animating separately.
const cardStagger = makeStagger(0.035, 0.1);

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeader
          title="Skills"
          subtitle="The analytics stack I use to turn raw data into decisions recruiters can trust."
        />

        <Reveal className="skills-groups" variants={groupStagger} amount={0.1}>
          {SKILL_GROUPS.map((group) => (
            <motion.div
              key={group.title}
              className={
                group.tier === "secondary" ? "skill-group skill-group-secondary" : "skill-group"
              }
              variants={cardReveal}
            >
              <h3 className="skill-group-title">
                <group.Icon size={16} aria-hidden="true" />
                {group.title}
              </h3>

              <motion.div className="skill-card-grid" variants={cardStagger}>
                {group.skills.map((skill) => (
                  <SkillCard key={skill.name} skill={skill} />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </Reveal>

        <Reveal className="skills-capabilities" amount={0.3}>
          <h3 className="capabilities-title">
            <Sparkles size={16} aria-hidden="true" />
            What I Do Best
          </h3>

          <ul className="capabilities-grid">
            {CAPABILITIES.map((item) => (
              <li key={item.label} className="capability-item">
                <item.Icon size={16} aria-hidden="true" />
                {item.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/** Bar fill inherits the "visible" state from its ancestors' whileInView. */
const barFill = (level) => ({
  hidden: { scaleX: 0 },
  visible: { scaleX: level / 100, transition: { duration: 0.9, ease: EASE, delay: 0.15 } },
});

/**
 * One skill: icon, name, and a proficiency bar that fills in once the card
 * scrolls into view. Core skills (the four called out as primary) render as a
 * wider, taller featured row instead of a compact tile - `grid-column: 1 / -1`
 * in CSS is what makes that span the full width of the category card.
 */
function SkillCard({ skill }) {
  const { name, Icon, level, core } = skill;

  return (
    <motion.div
      className={core ? "skill-card skill-card-core" : "skill-card"}
      variants={listReveal}
      whileHover={cardLift}
    >
      {core ? (
        <span className="skill-core-badge">
          <BadgeCheck size={11} aria-hidden="true" />
          Core
        </span>
      ) : null}

      <div className="skill-card-top">
        <motion.span className="skill-icon" variants={iconHover} initial="rest" whileHover="hover">
          <Icon size={core ? 22 : 16} aria-hidden="true" />
        </motion.span>
        <span className="skill-name">{name}</span>
      </div>

      <div
        className="skill-bar-track"
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name} proficiency: ${level}%`}
      >
        <motion.span className="skill-bar-fill" variants={barFill(level)} style={{ originX: 0 }} />
      </div>
    </motion.div>
  );
}
