import { ProjectArt } from "./projectArt";

/**
 * Full SVG frame (background wash + gradient defs) around one `ProjectArt`
 * piece. Shared by the card thumbnail, the drawer's cover image, and the
 * dashboard gallery, so the gradient/background boilerplate lives in one
 * place instead of three.
 */
export default function ProjectArtFrame({ variant, seed = 0, title, className }) {
  const uid = `${variant}-${seed}`;

  return (
    <svg
      className={className}
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={title ? `${title} preview` : "Project preview"}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--tint-card)" />
          <stop offset="100%" stopColor="var(--surface-strong)" />
        </linearGradient>
        <linearGradient id={`accent-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--brand-blue)" />
          <stop offset="100%" stopColor="var(--brand-cyan)" />
        </linearGradient>
      </defs>

      <rect width="400" height="240" fill={`url(#bg-${uid})`} />
      <ProjectArt variant={variant} seed={seed} gradientId={`accent-${uid}`} />
    </svg>
  );
}
