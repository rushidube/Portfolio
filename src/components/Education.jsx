import { motion } from "motion/react";
import { CalendarRange } from "lucide-react";
import { EASE, SPRING, cardLift, fadeLeft, makeStagger } from "../lib/animations";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

// Pulls a trailing "[bracketed]" aside (currently only the CGPA) out of the
// degree string so it can render as its own badge instead of literal
// brackets in running text - the words themselves are untouched.
function splitDegree(degree) {
  const match = degree.match(/^(.*?)\s*\[(.+)\]\s*$/);
  return match ? { title: match[1], badge: match[2] } : { title: degree, badge: null };
}

// Every dot and card registers directly against this container (the plain
// `.timeline-item` wrappers do not interrupt Motion's variant context), so the
// stagger is kept tight - seven staggered children add up quickly.
const timelineStagger = makeStagger(0.1, 0.15);

/** The connecting line draws itself before the entries appear on it. */
const lineGrow = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.9, ease: EASE } },
};

const dotPop = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: SPRING },
};

const EDUCATION = [
  {
    year: "2022 – 2026",
    degree: "B.E. in Computer Science [CGPA : 8.0]",
    place: "Alard College of Engineering and Management, Pune (SPPU)",
    detail:
      "Studied core computer science subjects including Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, and Web Technologies while developing strong analytical, programming, and problem-solving skills through academic and personal projects.",
    current: true,
  },
  {
    year: "2021 – 2022",
    degree: "Higher Secondary",
    place: "Barashiv Hanuman Junior College, Barashiv",
    detail:
      "Focused on Mathematics and Physics, building strong analytical thinking and early programming foundations.",
  },
  {
    year: "2020-2021",
    degree: "Secondary School",
    place: "Niwasi Highschool Barashiv",
    detail:
      "Completed secondary education with focus on Mathematics and Science, developing analytical thinking and problem-solving skills.",
  },
];

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <SectionHeader
          title="Education"
          subtitle="My academic journey and technical foundation"
        />

        <Reveal className="timeline" variants={timelineStagger} amount={0.15}>
          {/*
            The rail used to be a `border-left` on the list, which cannot be
            animated. It is now a real element so it can draw downwards; the
            border is kept as a transparent placeholder to preserve the exact
            1px of layout it contributed.
          */}
          <motion.span className="timeline-line" variants={lineGrow} />

          {EDUCATION.map((entry) => {
            const { title, badge } = splitDegree(entry.degree);
            return (
              <div className="timeline-item" key={entry.degree}>
                <motion.div
                  className={entry.current ? "timeline-dot timeline-dot-current" : "timeline-dot"}
                  variants={dotPop}
                />

                <motion.div
                  className="timeline-content"
                  variants={fadeLeft}
                  whileHover={cardLift}
                >
                  <span className="timeline-year">
                    <CalendarRange size={13} aria-hidden="true" />
                    {entry.year}
                  </span>
                  <h3>
                    {title}
                    {badge ? <span className="timeline-cgpa">{badge}</span> : null}
                  </h3>
                  <p className="timeline-place">{entry.place}</p>
                  <p className="timeline-detail">{entry.detail}</p>
                </motion.div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
