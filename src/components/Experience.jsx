import { motion } from "motion/react";
import { Briefcase, CalendarRange, CircleCheck } from "lucide-react";
import { cardLift, cardReveal, fadeUp, listReveal, makeStagger } from "../lib/animations";
import { techIcon } from "../lib/techIcons";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

const cardStagger = makeStagger(0.12, 0.05);
// Bullets land one after another so the responsibilities read as a list being
// written out, not a paragraph appearing at once.
const bulletStagger = makeStagger(0.08, 0.2);
const tagStagger = makeStagger(0.05, 0.25);

const EXPERIENCE = [
  {
    role: "Software Engineering Intern",
    company: "Wisdom Sprouts",
    period: "20 Dec 2024 – 03 Feb 2025",
    tech: ["React", "Node.js", "MongoDB", "Git", "GitHub"],
    points: [
      "Developed and enhanced web application features using React.js and Node.js.",
      "Assisted in backend API development and database integration using MongoDB.",
      "Developed responsive and reusable UI components to ensure cross-device compatibility.",
      "Collaborated with the development team using Git and GitHub for version control.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeader
          title="Experience"
          subtitle="My professional experience and practical exposure."
        />

        <Reveal className="experience-grid" variants={cardStagger} amount={0.15}>
          {EXPERIENCE.map((job) => (
            <motion.div
              key={job.role}
              className="exp-card"
              variants={cardReveal}
              whileHover={cardLift}
            >
              <div className="exp-header">
                <span className="exp-company">
                  <Briefcase size={13} aria-hidden="true" />
                  {job.company}
                </span>
                <span className="exp-period">
                  <CalendarRange size={13} aria-hidden="true" />
                  {job.period}
                </span>
              </div>

              <h3>{job.role}</h3>

              <motion.div className="exp-tags" variants={tagStagger}>
                {job.tech.map((item) => {
                  const Icon = techIcon(item);
                  return (
                    <motion.span key={item} variants={listReveal}>
                      <Icon size={11} aria-hidden="true" />
                      {item}
                    </motion.span>
                  );
                })}
              </motion.div>

              <motion.ul className="exp-points" variants={bulletStagger}>
                {job.points.map((point, index) => (
                  <motion.li key={index} variants={fadeUp}>
                    <CircleCheck size={14} aria-hidden="true" />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
