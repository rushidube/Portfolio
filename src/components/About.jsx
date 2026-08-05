import { useState } from "react";
import { motion } from "motion/react";
import {
  Database,
  Eraser,
  LayoutDashboard,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";
import { cardLift, cardReveal, fadeRight, iconHover, makeStagger } from "../lib/animations";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

const paragraphStagger = makeStagger(0.12, 0.05);
const cardStagger = makeStagger(0.08, 0.1);

// Matched against the paragraph strings below and wrapped in an accent span -
// keeps the highlighting data-driven instead of hand-splitting JSX per line.
const KEYWORDS = ["Data Analytics", "Business Intelligence", "Power BI", "Python", "SQL"];
const KEYWORD_PATTERN = new RegExp(`(${KEYWORDS.join("|")})`, "g");

const LEAD = "I turn raw, messy data into clear, decision-ready insight.";

const PARAGRAPHS = [
  "I'm a Computer Science graduate with a strong foundation in Data Structures & Algorithms, DBMS, Operating Systems, and Computer Networks - the fundamentals that shape how I approach every data problem with structure and discipline.",
  "My focus has grown into Data Analytics and Business Intelligence, where I use Python and SQL to clean, explore, and query data, then turn it into interactive Power BI dashboards that help teams make faster, evidence-backed decisions.",
  "I care about the story behind the numbers - finding patterns, validating assumptions, and packaging findings clearly enough that stakeholders can act on them with confidence.",
];

const HIGHLIGHTS = [
  {
    icon: Eraser,
    title: "Data Cleaning",
    body: "Wrangling messy, inconsistent data into structured, analysis-ready form.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Development",
    body: "Building interactive Power BI dashboards stakeholders actually use.",
  },
  {
    icon: TrendingUp,
    title: "Business Intelligence",
    body: "Turning raw numbers into insight that supports business decisions.",
  },
  {
    icon: Target,
    title: "KPI Reporting",
    body: "Defining and tracking the metrics that matter to the business.",
  },
  {
    icon: Search,
    title: "Exploratory Data Analysis",
    body: "Digging into datasets to surface patterns before they get reported.",
  },
  {
    icon: Database,
    title: "SQL Reporting",
    body: "Writing efficient queries to pull and shape data for reporting.",
  },
];

/** Splits a paragraph on the keyword list and wraps matches in an accent span. */
function highlightKeywords(text) {
  return text.split(KEYWORD_PATTERN).map((part, index) =>
    KEYWORDS.includes(part) ? (
      <span key={index} className="about-keyword">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeader
          title="About Me"
          subtitle="A short story of my journey into data analytics and technology."
        />

        <div className="about-grid">
          {/* Paragraphs come in from the left and cards from below, so the two
              columns read as separate thoughts rather than one wall of motion. */}
          <Reveal className="about-text" variants={paragraphStagger} amount={0.15}>
            <motion.p className="about-lead" variants={fadeRight}>
              {LEAD}
            </motion.p>
            {PARAGRAPHS.map((paragraph, index) => (
              <motion.p key={index} variants={fadeRight}>
                {highlightKeywords(paragraph)}
              </motion.p>
            ))}
          </Reveal>

          <Reveal className="about-highlights" variants={cardStagger} amount={0.15}>
            {HIGHLIGHTS.map((item) => (
              <AboutCard key={item.title} item={item} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * The card spends its `variants` slot on the scroll reveal, so its hover state
 * is a plain target. The icon runs its own hover variant driven by explicit
 * state rather than inherited from the card - inheritance would leave it stuck
 * at its hovered angle, because the card's resting label ("visible") means
 * nothing to the icon's variant set.
 */
function AboutCard({ item }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      className="about-card"
      variants={cardReveal}
      whileHover={cardLift}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        className="about-icon"
        variants={iconHover}
        initial="rest"
        animate={hovered ? "hover" : "rest"}
      >
        <Icon size={17} aria-hidden="true" />
      </motion.div>
      <div>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
      </div>
    </motion.div>
  );
}
