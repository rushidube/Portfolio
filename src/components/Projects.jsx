import { Suspense, lazy, memo, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useTransform } from "motion/react";
import {
  ArrowUpDown,
  CalendarRange,
  CircleCheck,
  ExternalLink,
  Loader2,
  RotateCcw,
  Search,
  SearchX,
  Workflow,
  X,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import {
  EASE,
  VIEWPORT_LOOSE,
  cardLift,
  linkNudge,
  listReveal,
  makeStagger,
  pillLift,
} from "../lib/animations";
import { techIcon } from "../lib/techIcons";
import { PROJECTS } from "../data/projects";
import { useFinePointer } from "../hooks/useMediaQuery";
import { useTilt } from "../hooks/useTilt";
import EmptyState from "./ui/EmptyState";
import FilterChip from "./ui/FilterChip";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";
import ProjectThumbnail from "./ui/ProjectThumbnail";

const CaseStudyDrawer = lazy(() => import("./ui/CaseStudyDrawer"));

const tagStagger = makeStagger(0.05, 0.15);

// These four carry the most weight on a Data Analyst resume, so their badge
// gets the accent treatment wherever they show up in a project's tech list -
// everything else stays in the quieter, secondary style.
const PRIORITY_TECH = new Set(["Power BI", "SQL", "Python", "Excel"]);

// Precomputed once at module load (not per render) - a flat, lowercased blob
// of everything a search should match against.
const SEARCHABLE_PROJECTS = PROJECTS.map((project) => ({
  ...project,
  searchIndex: [project.title, project.domain, project.tagline, ...project.tech, ...project.categories, ...project.keywords]
    .join(" ")
    .toLowerCase(),
}));

// Order mirrors how a recruiter would scan them - analytics-first, since
// that's the primary positioning - but only categories with a real project
// behind them ever render as a chip.
const CATEGORY_ORDER = ["Data Analytics", "Python", "React", "Dashboard", "Web Development"];
const AVAILABLE_CATEGORIES = CATEGORY_ORDER.filter((category) =>
  PROJECTS.some((project) => project.categories.includes(category)),
);

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "data-analytics", label: "Data Analytics" },
  { value: "web-development", label: "Web Development" },
];

function sortProjects(list, sortBy) {
  if (sortBy === "newest") {
    return [...list].sort((a, b) => Number(b.timeframe) - Number(a.timeframe));
  }
  if (sortBy === "data-analytics" || sortBy === "web-development") {
    const category = sortBy === "data-analytics" ? "Data Analytics" : "Web Development";
    // Array.prototype.sort is stable, so this reads as "bring matches to the
    // front", not a hard re-shuffle - everything else keeps its order.
    return [...list].sort((a, b) => Number(b.categories.includes(category)) - Number(a.categories.includes(category)));
  }
  return list; // "Featured" - the curated order the array is already in.
}

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matched = SEARCHABLE_PROJECTS.filter((project) => {
      const matchesCategory = activeCategory === "All" || project.categories.includes(activeCategory);
      const matchesSearch = query === "" || project.searchIndex.includes(query);
      return matchesCategory && matchesSearch;
    });
    return sortProjects(matched, sortBy);
  }, [searchQuery, activeCategory, sortBy]);

  function handleClearFilters() {
    setSearchQuery("");
    setActiveCategory("All");
    setSortBy("featured");
  }

  const hasActiveFilters = searchQuery.trim() !== "" || activeCategory !== "All";

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeader
          title="Projects"
          subtitle="Case studies in turning raw data and rough ideas into usable products."
        />

        <Reveal className="projects-toolbar-block" amount={0.1}>
          <div className="projects-toolbar">
            <div className="projects-search">
              <Search size={16} aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title, tech, domain..."
                aria-label="Search projects"
              />
              {searchQuery ? (
                <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search">
                  <X size={14} aria-hidden="true" />
                </button>
              ) : null}
            </div>

            <label className="projects-sort">
              <ArrowUpDown size={14} aria-hidden="true" />
              <span>Sort</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort projects">
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="projects-filters">
            <div className="projects-chip-row" role="group" aria-label="Filter projects by category">
              <FilterChip label="All" active={activeCategory === "All"} onClick={() => setActiveCategory("All")} />
              {AVAILABLE_CATEGORIES.map((category) => (
                <FilterChip
                  key={category}
                  label={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                />
              ))}
            </div>

            <span className="projects-results-count" aria-live="polite">
              Showing {filteredProjects.length} of {PROJECTS.length} Projects
            </span>
          </div>
        </Reveal>

        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No matching projects found"
            message="Try a different search term or clear the active filters."
            action={{ icon: RotateCcw, label: "Clear Filters", onClick: handleClearFilters }}
          />
        ) : (
          <div className="projects-grid">
            <AnimatePresence initial={false}>
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onOpenCaseStudy={setActiveProject}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {hasActiveFilters && filteredProjects.length > 0 ? (
          <button type="button" className="projects-clear-inline" onClick={handleClearFilters}>
            <RotateCcw size={13} aria-hidden="true" />
            Clear filters
          </button>
        ) : null}
      </div>

      {/* Only imported once a project is actually opened - see the lazy()
          above. Nothing in this bundle is paid for by a visitor who never
          clicks "Case Study". The fallback covers the (usually brief) gap
          while that chunk downloads on a cold cache, so the click always gets
          an immediate response instead of a silent pause. */}
      {activeProject ? (
        <Suspense fallback={<DrawerLoadingFallback />}>
          <CaseStudyDrawer project={activeProject} onClose={() => setActiveProject(null)} />
        </Suspense>
      ) : null}
    </section>
  );
}

function DrawerLoadingFallback() {
  return (
    <div className="drawer-loading" role="status" aria-live="polite" aria-label="Loading case study">
      <div className="drawer-backdrop" aria-hidden="true" />
      <motion.div
        className="drawer-loading-panel"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        <Loader2 size={18} className="spin" aria-hidden="true" />
        <span>Loading case study…</span>
      </motion.div>
    </div>
  );
}

/**
 * Project card with a restrained 3D tilt and a highlight that tracks the
 * pointer. "Case Study" no longer expands in place - it opens the full
 * slide-over drawer (see CaseStudyDrawer) via `onOpenCaseStudy`.
 *
 * Enter/exit (search, filter, sort) is handled here directly rather than via
 * the shared scroll-triggered `Reveal` stagger: a filter change needs to
 * animate cards in and out at any time, not just once on first scroll into
 * view, so this owns its own mount/unmount lifecycle and reads its stagger
 * delay from its position in the *currently filtered* list.
 *
 * Memoized because `onOpenCaseStudy` toggling `activeProject` lives in this
 * same list's parent - without this, opening or closing the case study drawer
 * would re-render every card on screen (icons, tilt hooks and all) for
 * unrelated state it never reads.
 */
const ProjectCard = memo(function ProjectCard({ project, index, onOpenCaseStudy }) {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const interactive = finePointer && !reduceMotion;

  const tilt = useTilt({ max: 6, disabled: !interactive });

  const glareX = useTransform(tilt.pointerX, (value) => `${(value + 0.5) * 100}%`);
  const glareY = useTransform(tilt.pointerY, (value) => `${(value + 0.5) * 100}%`);

  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VIEWPORT_LOOSE}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2, ease: EASE } }}
      transition={{ duration: 0.35, ease: EASE, delay: index * 0.05 }}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <motion.div
        className="project-inner"
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        whileHover={cardLift}
      >
        {interactive ? (
          <motion.div
            className="project-glare"
            style={{ "--glare-x": glareX, "--glare-y": glareY }}
          />
        ) : null}

        <ProjectThumbnail variant={project.thumbnail} title={project.title} />

        <div className="project-body">
          <h3>{project.title}</h3>
          <p className="project-tagline">{project.tagline}</p>

          <ul className="project-meta">
            <li className="meta-badge">
              <CalendarRange size={13} aria-hidden="true" />
              {project.timeframe}
            </li>
            <li className="meta-badge meta-badge-status">
              <CircleCheck size={13} aria-hidden="true" />
              {project.status}
            </li>
          </ul>

          <motion.div className="project-tags" variants={tagStagger} initial="hidden" animate="visible">
            {project.tech.map((item) => {
              const Icon = techIcon(item);
              return (
                <motion.span
                  key={item}
                  className={PRIORITY_TECH.has(item) ? "tech-priority" : undefined}
                  variants={listReveal}
                  whileHover={pillLift}
                >
                  <Icon size={11} aria-hidden="true" />
                  {item}
                </motion.span>
              );
            })}
          </motion.div>

          <div className="project-actions">
            {project.live ? (
              <motion.a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
                whileHover={linkNudge}
              >
                <ExternalLink size={14} aria-hidden="true" />
                Live Demo
              </motion.a>
            ) : null}

            <motion.a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-sm"
              whileHover={linkNudge}
            >
              <FaGithub size={14} aria-hidden="true" />
              GitHub
            </motion.a>

            <motion.button
              type="button"
              className="btn btn-case-study btn-sm"
              onClick={() => onOpenCaseStudy(project)}
              whileHover={linkNudge}
            >
              <Workflow size={14} aria-hidden="true" />
              Case Study
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
