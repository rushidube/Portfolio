import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { EASE } from "../../lib/animations";
import ProjectArtFrame from "./ProjectArtFrame";

/**
 * Fullscreen dashboard gallery viewer. Rendered by CaseStudyDrawer, which
 * already lives in a body-level portal, so this only needs its own stacking
 * context above the drawer, not a second portal.
 *
 * Each image change re-keys the frame, so it replays its scale-in "zoom" on
 * every arrow press, not just the first open - a plain crossfade would read
 * as flat next to the rest of the site's motion language.
 */
export default function GalleryLightbox({ images, variant, title, index, onClose, onNavigate }) {
  const open = index !== null;

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate(1);
      if (event.key === "ArrowLeft") onNavigate(-1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} - image ${index + 1} of ${images.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={onClose}
            aria-label="Close image viewer"
          >
            <X size={18} aria-hidden="true" />
          </button>

          {images.length > 1 ? (
            <button
              type="button"
              className="lightbox-nav lightbox-prev"
              onClick={(event) => {
                event.stopPropagation();
                onNavigate(-1);
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
          ) : null}

          <motion.figure
            key={index}
            className="lightbox-frame"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.32, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
          >
            <ProjectArtFrame
              variant={variant}
              seed={images[index].seed}
              title={title}
              className="lightbox-art"
            />
            <figcaption className="lightbox-caption">{images[index].caption}</figcaption>
          </motion.figure>

          {images.length > 1 ? (
            <button
              type="button"
              className="lightbox-nav lightbox-next"
              onClick={(event) => {
                event.stopPropagation();
                onNavigate(1);
              }}
              aria-label="Next image"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          ) : null}

          <div className="lightbox-counter">
            {index + 1} / {images.length}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
