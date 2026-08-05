import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Award,
  BadgeCheck,
  CalendarCheck,
  ChartColumn,
  ExternalLink,
  FileSpreadsheet,
  FolderSearch,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { FaMicrosoft } from "react-icons/fa";

import { EASE, VIEWPORT_LOOSE, cardLift, pillLift, makeStagger } from "../lib/animations";
import { CERTIFICATIONS } from "../data/certifications";
import { useCountUp } from "../hooks/useCountUp";
import EmptyState from "./ui/EmptyState";
import FilterChip from "./ui/FilterChip";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

const LINKEDIN_CERTS_URL = "https://www.linkedin.com/in/rushikeshkdube/details/certifications/";

// Mirrors the DOM order sections appear on the page (Skills -> Certifications
// -> Projects), so chips read in the same priority as everywhere else on the
// site. Filtered to categories that actually have a certificate behind them.
const CATEGORY_ORDER = ["Power BI", "Excel", "Data Analytics"];
const AVAILABLE_CATEGORIES = CATEGORY_ORDER.filter((category) =>
  CERTIFICATIONS.some((cert) => cert.category === category),
);

const CATEGORY_ICONS = {
  "Power BI": ChartColumn,
  Excel: FileSpreadsheet,
  "Data Analytics": TrendingUp,
};

// Only orgs with a real certificate behind them render - Google, IBM,
// Coursera, Udemy and LinkedIn Learning are deliberately absent.
const ORG_ORDER = ["Microsoft", "Anudip Foundation"];
const AVAILABLE_ORGS = ORG_ORDER.map((issuer) => ({
  issuer,
  count: CERTIFICATIONS.filter((cert) => cert.issuer === issuer).length,
}));

// Every number here is directly countable from CERTIFICATIONS, or - for the
// learning path - already stated on the About section. No invented metric
// (e.g. "learning hours") is shown, since there is no real source for one.
const STATS = [
  { label: "Certifications Earned", value: CERTIFICATIONS.length, kind: "count", Icon: Award },
  { label: "Platforms", value: AVAILABLE_ORGS.length, kind: "count", Icon: BadgeCheck },
  {
    label: "Current Learning Path",
    value: "Data Structures & Algorithms",
    kind: "text",
    Icon: GraduationCap,
  },
];

const orgStagger = makeStagger(0.06, 0.1);
const statStagger = makeStagger(0.08, 0.15);

export default function Certifications() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCertifications = useMemo(() => {
    if (activeCategory === "All") return CERTIFICATIONS;
    return CERTIFICATIONS.filter((cert) => cert.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="certifications" className="section">
      <div className="container">
        <SectionHeader
          title="Certifications"
          subtitle="Verified credentials in Power BI, Excel and data analytics from Microsoft and Anudip Foundation."
        />

        <Reveal className="cert-orgs" variants={orgStagger} amount={0.4}>
          {AVAILABLE_ORGS.map((org) => (
            <OrgBadge key={org.issuer} {...org} />
          ))}
        </Reveal>

        <Reveal className="cert-stats" variants={statStagger} amount={0.3}>
          {STATS.map((stat) => (
            <CertStat key={stat.label} {...stat} />
          ))}
        </Reveal>

        <div className="cert-filters" role="group" aria-label="Filter certifications by category">
          <FilterChip
            label="All"
            active={activeCategory === "All"}
            onClick={() => setActiveCategory("All")}
          />
          {AVAILABLE_CATEGORIES.map((category) => (
            <FilterChip
              key={category}
              label={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </div>

        {filteredCertifications.length === 0 ? (
          <EmptyState
            icon={FolderSearch}
            title="No certifications in this category"
            message="Try a different filter to see the rest of the credentials."
            action={{ label: "Show All", onClick: () => setActiveCategory("All") }}
          />
        ) : (
          <div className="cert-grid">
            <AnimatePresence initial={false}>
              {filteredCertifications.map((cert, index) => (
                <CertificateCard key={cert.id} cert={cert} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

function OrgBadge({ issuer, count }) {
  return (
    <motion.div className="cert-org-badge" whileHover={pillLift}>
      <IssuerMark issuer={issuer} size={20} />
      <span className="cert-org-name">{issuer}</span>
      <span className="cert-org-count">{count}</span>
    </motion.div>
  );
}

/** One KPI tile above the grid. Text-valued stats (the learning path) skip the count-up. */
function CertStat({ label, value, kind, Icon }) {
  const reduceMotion = useReducedMotion();
  const display = useCountUp(kind === "count" ? value : 0, kind === "count" && !reduceMotion);

  return (
    <motion.div className="cert-stat" whileHover={cardLift}>
      <span className="cert-stat-icon">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="cert-stat-value">{kind === "count" ? display : value}</span>
      <span className="cert-stat-label">{label}</span>
    </motion.div>
  );
}

/** Microsoft's real four-square mark for Microsoft credentials; a plain initial badge otherwise - no invented logo. */
function IssuerMark({ issuer, size = 18 }) {
  if (issuer === "Microsoft") {
    return (
      <span
        className="issuer-mark issuer-mark-ms"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <FaMicrosoft size={size * 0.72} />
      </span>
    );
  }

  return (
    <span
      className="issuer-mark issuer-mark-generic"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      aria-hidden="true"
    >
      {issuer.charAt(0)}
    </span>
  );
}

function CertificateCard({ cert, index }) {
  const CategoryIcon = CATEGORY_ICONS[cert.category] ?? Award;

  return (
    <motion.div
      className="cert-card"
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VIEWPORT_LOOSE}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2, ease: EASE } }}
      transition={{ duration: 0.35, ease: EASE, delay: index * 0.06 }}
      whileHover={cardLift}
    >
      <span className="cert-card-border" aria-hidden="true" />

      <div className="cert-card-inner">
        <div className="cert-thumb">
          <div className="cert-thumb-art">
            <CategoryIcon size={40} aria-hidden="true" />
          </div>
          <span className="cert-thumb-seal" aria-hidden="true">
            <BadgeCheck size={14} />
          </span>
        </div>

        <div className="cert-body">
          <div className="cert-issuer-row">
            <IssuerMark issuer={cert.issuer} size={22} />
            <span className="cert-issuer-name">{cert.issuer}</span>
          </div>

          <h3 className="cert-title">{cert.title}</h3>

          <div className="cert-meta">
            {cert.date ? (
              <span className="cert-meta-item">
                <CalendarCheck size={13} aria-hidden="true" />
                {cert.date}
              </span>
            ) : null}
            {cert.credentialId ? (
              <span className="cert-meta-item">ID: {cert.credentialId}</span>
            ) : null}
            {cert.note ? <span className="cert-meta-badge">{cert.note}</span> : null}
          </div>

          <div className="cert-skills">
            {cert.skills.map((skill) => (
              <motion.span key={skill} className="cert-skill-pill" whileHover={pillLift}>
                {skill}
              </motion.span>
            ))}
          </div>

          <a
            href={LINKEDIN_CERTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm cert-verify-btn"
            aria-label={`View "${cert.title}" credential on LinkedIn`}
          >
            <ExternalLink size={14} aria-hidden="true" />
            View Credential
          </a>
        </div>
      </div>
    </motion.div>
  );
}
