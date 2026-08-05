import { Eye } from "lucide-react";
import ProjectArtFrame from "./ProjectArtFrame";

/**
 * Card-sized preview art. See projectArt.jsx for the actual SVG generators -
 * this component just frames one at seed 0 with the card's hover-zoom chrome.
 */
export default function ProjectThumbnail({ variant, title }) {
  return (
    <div className="project-thumb">
      <div className="project-thumb-art">
        <ProjectArtFrame variant={variant} seed={0} title={title} />
      </div>

      <div className="project-thumb-sheen" aria-hidden="true" />

      <div className="project-thumb-cta" aria-hidden="true">
        <Eye size={16} />
        <span>Preview</span>
      </div>
    </div>
  );
}
