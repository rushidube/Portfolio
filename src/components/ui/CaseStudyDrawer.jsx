import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Braces,
  CalendarRange,
  CircleCheck,
  Database,
  Download,
  ExternalLink,
  Images,
  Lightbulb,
  Maximize2,
  TrendingUp,
  TriangleAlert,
  UserRound,
  Workflow,
  X,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { EASE_IN_OUT, buttonHover } from "../../lib/animations";
import { techIcon } from "../../lib/techIcons";
import { downloadCaseStudyReport } from "../../lib/caseStudyReport";
import { useToast } from "../../lib/toast";
import ProjectArtFrame from "./ProjectArtFrame";
import GalleryLightbox from "./GalleryLightbox";

const GALLERY_SEEDS = [1, 2, 3];

/**
 * Full-height case study drawer, opened from a project card's "Case Study"
 * button.
 *
 * Rendered through a portal to `document.body` rather than in place: the
 * card ancestors carry a `transform` (the pointer tilt) and `overflow:
 * hidden`, and a `transform` on an ancestor turns it into the containing
 * block for any `position: fixed` descendant - without the portal this
 * drawer would be pinned to the card, not the viewport.
 *
 * This component is itself the thing React.lazy code-splits (see
 * Projects.jsx) - once loaded it stays mounted for the rest of the session so
 * its own AnimatePresence can run the close animation instead of the parent
 * yanking it out of the tree mid-exit; `project` toggles between an object
 * and `null` rather than the component mounting/unmounting.
 */
export default function CaseStudyDrawer({ project, onClose }) {
  const open = Boolean(project);
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const { showToast } = useToast();

  function handleDownloadReport() {
    try {
      downloadCaseStudyReport(project);
      showToast({ variant: "success", message: "Case study report downloaded." });
    } catch {
      showToast({ variant: "error", message: "Couldn't generate the report. Please try again." });
    }
  }

  // Read inside the drawer's own keydown handler without adding lightboxIndex
  // to that effect's deps - the lightbox has its own Escape listener, and the
  // drawer's should defer to it (close the topmost layer, not both at once)
  // without tearing down and re-running the scroll-lock/focus setup on every
  // gallery navigation.
  const lightboxOpenRef = useRef(false);
  useEffect(() => {
    lightboxOpenRef.current = lightboxIndex !== null;
  }, [lightboxIndex]);

  const galleryImages = useMemo(() => {
    if (!project) return [];
    return GALLERY_SEEDS.map((seed) => ({ seed, caption: `${project.title} - view ${seed}` }));
  }, [project]);

  // Closing always goes through here so the lightbox never survives into the
  // next project - a plain `onClose` prop call wouldn't reset it.
  function handleClose() {
    setLightboxIndex(null);
    onClose();
  }

  // Body-scroll lock, ESC-to-close and focus handling all key off the same
  // open/close transition, so one effect owns the full lifecycle.
  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    function handleKeyDown(event) {
      // The gallery lightbox owns Escape while it's open - one press closes
      // the topmost layer, not both at once.
      if (event.key === "Escape" && !lightboxOpenRef.current) handleClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function navigateLightbox(direction) {
    setLightboxIndex((current) => {
      if (current === null || galleryImages.length === 0) return current;
      return (current + direction + galleryImages.length) % galleryImages.length;
    });
  }

  return createPortal(
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="backdrop"
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
          />
        ) : null}

        {open ? (
          <motion.aside
            key="panel"
            ref={panelRef}
            className="case-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-drawer-title"
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: EASE_IN_OUT }}
          >
            <button type="button" className="drawer-close" onClick={handleClose} aria-label="Close case study">
              <X size={18} aria-hidden="true" />
            </button>

            <div className="case-drawer-scroll">
              {/* Project Overview ------------------------------------------------ */}
              <section className="cd-overview">
                <div className="cd-cover">
                  <ProjectArtFrame variant={project.thumbnail} seed={0} title={project.title} />
                </div>

                <div className="cd-overview-body">
                  <span className="meta-badge meta-badge-status">
                    <CircleCheck size={13} aria-hidden="true" />
                    {project.status}
                  </span>

                  <h2 id="case-drawer-title">{project.title}</h2>
                  <p className="cd-summary">{project.summary}</p>

                  <div className="cd-overview-meta">
                    <div>
                      <span className="cd-meta-label">
                        <UserRound size={13} aria-hidden="true" />
                        Role
                      </span>
                      <span>{project.role}</span>
                    </div>
                    <div>
                      <span className="cd-meta-label">
                        <CalendarRange size={13} aria-hidden="true" />
                        Timeline
                      </span>
                      <span>{project.timeframe}</span>
                    </div>
                    <div>
                      <span className="cd-meta-label">
                        <project.DomainIcon size={13} aria-hidden="true" />
                        Domain
                      </span>
                      <span>{project.domain}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Business Problem -------------------------------------------------- */}
              <SectionBlock icon={TriangleAlert} title="Business Problem">
                <dl className="cd-problem-grid">
                  <div>
                    <dt>What was the problem?</dt>
                    <dd>{project.problem}</dd>
                  </div>
                  <div>
                    <dt>Who was affected?</dt>
                    <dd>{project.who}</dd>
                  </div>
                  <div>
                    <dt>Why it mattered</dt>
                    <dd>{project.why}</dd>
                  </div>
                </dl>
              </SectionBlock>

              {/* Dataset - only for data-driven projects --------------------------- */}
              {project.dataset ? (
                <SectionBlock icon={Database} title="Dataset">
                  <div className="cd-dataset-grid">
                    <DatasetStat label="Source" value={project.dataset.source} wide />
                    <DatasetStat label="Rows" value={project.dataset.rows} />
                    <DatasetStat label="Columns" value={project.dataset.columns} />
                    <DatasetStat label="Size" value={project.dataset.size} />
                    <DatasetStat label="Missing Values" value={project.dataset.missing} wide />
                  </div>

                  <h4 className="cd-subheading">Cleaning Steps</h4>
                  <ul className="cd-checklist">
                    {project.dataset.cleaning.map((step) => (
                      <li key={step}>
                        <CircleCheck size={14} aria-hidden="true" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </SectionBlock>
              ) : null}

              {/* Workflow ----------------------------------------------------------- */}
              <SectionBlock icon={Workflow} title="Workflow">
                <ol className="cd-timeline">
                  {project.workflow.map((step) => (
                    <li key={step.label} className="cd-timeline-step">
                      <span className="cd-timeline-icon">
                        <step.Icon size={16} aria-hidden="true" />
                      </span>
                      <div>
                        <h4>{step.label}</h4>
                        <p>{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </SectionBlock>

              {/* Technology Stack ----------------------------------------------------- */}
              <SectionBlock icon={Braces} title="Technology Stack">
                <div className="cd-tech-grid">
                  {project.tech.map((name) => {
                    const Icon = techIcon(name);
                    return (
                      <span key={name} className="cd-tech-badge">
                        <Icon size={16} aria-hidden="true" />
                        {name}
                      </span>
                    );
                  })}
                </div>
              </SectionBlock>

              {/* Key Insights ----------------------------------------------------- */}
              <SectionBlock icon={Lightbulb} title="Key Insights">
                <div className="cd-insight-grid">
                  {project.insights.map((insight) => (
                    <div className="cd-insight-card" key={insight.title}>
                      <span className="cd-insight-icon">
                        <insight.Icon size={18} aria-hidden="true" />
                      </span>
                      <h4>{insight.title}</h4>
                      <p>{insight.description}</p>
                    </div>
                  ))}
                </div>
              </SectionBlock>

              {/* Business Impact --------------------------------------------------- */}
              <SectionBlock icon={TrendingUp} title="Business Impact">
                <div className="cd-impact-grid">
                  {project.impactStats.map((stat) => (
                    <div className="cd-impact-stat" key={stat.label}>
                      <span className="cd-impact-value">{stat.value}</span>
                      <span className="cd-impact-label">{stat.label}</span>
                      <p>{stat.description}</p>
                    </div>
                  ))}
                </div>
              </SectionBlock>

              {/* Dashboard Gallery -------------------------------------------------- */}
              <SectionBlock icon={Images} title="Dashboard Gallery">
                <div className="cd-gallery-grid">
                  {galleryImages.map((image, index) => (
                    <button
                      key={image.seed}
                      type="button"
                      className="cd-gallery-thumb"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`Open ${image.caption} fullscreen`}
                    >
                      <ProjectArtFrame variant={project.thumbnail} seed={image.seed} title={project.title} />
                      <span className="cd-gallery-zoom" aria-hidden="true">
                        <Maximize2 size={14} />
                      </span>
                    </button>
                  ))}
                </div>
              </SectionBlock>
            </div>

            {/* Action Buttons - pinned so they never require scrolling to find. */}
            <div className="cd-actions">
              {project.live ? (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
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
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <FaGithub size={14} aria-hidden="true" />
                GitHub
              </motion.a>

              <motion.button
                type="button"
                className="btn btn-case-study btn-sm"
                onClick={handleDownloadReport}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Download size={14} aria-hidden="true" />
                Download Report
              </motion.button>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <GalleryLightbox
        images={galleryImages}
        variant={project?.thumbnail}
        title={project?.title}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={navigateLightbox}
      />
    </>,
    document.body,
  );
}

function SectionBlock({ icon: Icon, title, children }) {
  return (
    <section className="cd-section">
      <h3 className="cd-section-title">
        <Icon size={16} aria-hidden="true" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function DatasetStat({ label, value, wide }) {
  return (
    <div className={wide ? "cd-dataset-stat cd-dataset-stat-wide" : "cd-dataset-stat"}>
      <span className="cd-meta-label">{label}</span>
      <span>{value}</span>
    </div>
  );
}
