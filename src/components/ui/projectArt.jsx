/**
 * Stylised project preview art, shared by the card thumbnail and the case
 * study drawer's dashboard gallery.
 *
 * None of the three portfolio projects have production screenshots to ship,
 * so instead of a blank header or a stock photo passed off as a screenshot,
 * each project gets an inline-SVG mock of its own UI - a BI-style dashboard,
 * a browser chrome, or a game board - drawn entirely from theme tokens. That
 * means it repaints instantly on a light/dark toggle and costs zero network
 * requests or image weight, even across a multi-image gallery.
 *
 * Each generator takes a `seed` (0, 1, 2...) so the gallery can show a few
 * distinct-looking panels of the same UI - different chart values, a
 * different card highlighted - without hand-authoring separate art per
 * image.
 */

export function ProjectArt({ variant, seed = 0, gradientId }) {
  if (variant === "dashboard") return <DashboardArt gradientId={gradientId} seed={seed} />;
  if (variant === "browser") return <BrowserArt gradientId={gradientId} seed={seed} />;
  if (variant === "portal") return <PortalArt gradientId={gradientId} seed={seed} />;
  return <GameArt seed={seed} />;
}

/** BI-style dashboard: chrome bar, AQI gauge, bar chart, trend line. */
function DashboardArt({ gradientId, seed = 0 }) {
  const bases = [58, 92, 72, 116, 86, 102];
  const bars = bases.map((base, index) => {
    const wobble = ((seed + index) * 37) % 40;
    return { x: 176 + index * 28, h: Math.max(30, Math.min(126, base + wobble - 20)) };
  });

  const gaugeFill = 150 + ((seed * 53) % 110);
  const sparkOffset = (seed * 11) % 18;

  return (
    <g>
      <rect width="400" height="30" fill="var(--surface-pill)" opacity="0.6" />
      <circle cx="16" cy="15" r="3.5" fill="var(--danger)" opacity="0.55" />
      <circle cx="28" cy="15" r="3.5" fill="#ffd166" opacity="0.6" />
      <circle cx="40" cy="15" r="3.5" fill="var(--accent)" opacity="0.7" />
      <rect x="58" y="9" width="104" height="12" rx="6" fill="var(--surface-tag)" />
      <rect x="332" y="8" width="50" height="14" rx="7" fill="var(--accent)" opacity="0.22" />

      <circle cx="82" cy="142" r="46" fill="none" stroke="var(--border-mid)" strokeWidth="10" />
      <circle
        cx="82"
        cy="142"
        r="46"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="10"
        strokeDasharray={`${gaugeFill} 289`}
        strokeLinecap="round"
        transform="rotate(-90 82 142)"
      />
      <text x="82" y="138" textAnchor="middle" fontSize="19" fontWeight="700" fill="var(--text-strong)">
        AQI
      </text>
      <text x="82" y="156" textAnchor="middle" fontSize="10" fill="var(--muted)">
        Live
      </text>

      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={214 - bar.h}
          width="20"
          height={bar.h}
          rx="5"
          fill={`url(#${gradientId})`}
          opacity="0.85"
        />
      ))}

      <polyline
        points={`176,${58 - sparkOffset} 204,${44 + sparkOffset} 232,${54 - sparkOffset} 260,${28 + sparkOffset} 288,${40 - sparkOffset} 316,${24 + sparkOffset} 348,${36 - sparkOffset}`}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </g>
  );
}

/** Browser chrome over a hero block and a row of project cards. */
function BrowserArt({ gradientId, seed = 0 }) {
  const highlighted = seed % 3;

  return (
    <g>
      <rect width="400" height="26" fill="var(--surface-pill)" opacity="0.6" />
      <circle cx="14" cy="13" r="3" fill="var(--danger)" opacity="0.5" />
      <circle cx="25" cy="13" r="3" fill="#ffd166" opacity="0.55" />
      <circle cx="36" cy="13" r="3" fill="var(--accent)" opacity="0.65" />
      <rect x="60" y="6" width="220" height="14" rx="7" fill="var(--surface-tag)" />

      <circle cx="60" cy="72" r="20" fill={`url(#${gradientId})`} opacity="0.9" />
      <rect x="92" y="58" width="160" height="10" rx="5" fill="var(--text-soft)" opacity="0.55" />
      <rect x="92" y="76" width="110" height="8" rx="4" fill="var(--muted)" opacity="0.4" />
      <rect x="92" y="94" width="72" height="16" rx="8" fill="var(--accent)" opacity="0.3" />

      {[24, 150, 276].map((x, index) => (
        <g key={x}>
          <rect
            x={x}
            y="140"
            width="104"
            height="72"
            rx="10"
            fill="var(--surface-tag)"
            stroke={index === highlighted ? "var(--accent)" : "var(--border-soft)"}
            strokeWidth={index === highlighted ? 2 : 1}
          />
          <rect x={x + 12} y="154" width="80" height="8" rx="4" fill="var(--text-soft)" opacity="0.5" />
          <rect x={x + 12} y="168" width="58" height="6" rx="3" fill="var(--muted)" opacity="0.4" />
          <rect
            x={x + 12}
            y="192"
            width="36"
            height="10"
            rx="5"
            fill="var(--accent)"
            opacity={index === highlighted ? 0.55 : 0.35}
          />
        </g>
      ))}
    </g>
  );
}

/**
 * Role switcher over a permission checklist - reads as "role-based access",
 * the actual thing this project is about, rather than a generic app screen.
 * `seed` picks which of the three role pills is "active", so the gallery can
 * show a different role selected per image without new artwork.
 */
function PortalArt({ gradientId, seed = 0 }) {
  const roles = ["Admin", "Faculty", "Student"];
  const rolePositions = [36, 158, 280];
  const active = seed % roles.length;

  const permissionRows = [72, 96, 120, 144, 168].map((y, index) => ({
    y,
    width: 140 + ((seed + index) * 23) % 60,
  }));

  return (
    <g>
      <rect width="400" height="30" fill="var(--surface-pill)" opacity="0.6" />
      <circle cx="16" cy="15" r="3.5" fill="var(--danger)" opacity="0.55" />
      <circle cx="28" cy="15" r="3.5" fill="#ffd166" opacity="0.6" />
      <circle cx="40" cy="15" r="3.5" fill="var(--accent)" opacity="0.7" />
      <rect x="58" y="9" width="104" height="12" rx="6" fill="var(--surface-tag)" />
      <rect x="332" y="8" width="50" height="14" rx="7" fill="var(--accent)" opacity="0.22" />

      {roles.map((role, index) => {
        const isActive = index === active;
        const x = rolePositions[index];
        return (
          <g key={role}>
            <rect
              x={x}
              y="48"
              width="84"
              height="30"
              rx="15"
              fill={isActive ? `url(#${gradientId})` : "var(--surface-tag)"}
              stroke={isActive ? "none" : "var(--border-mid)"}
            />
            <text
              x={x + 42}
              y="67"
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill={isActive ? "var(--on-accent)" : "var(--text-soft)"}
            >
              {role}
            </text>
          </g>
        );
      })}

      <rect x="36" y="100" width="328" height="118" rx="12" fill="var(--surface-tag)" opacity="0.6" />
      {permissionRows.map(({ y, width }) => (
        <g key={y}>
          <circle cx="56" cy={y} r="7" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.85" />
          <path
            d={`M 53 ${y} l 2.4 2.6 L 59.4 ${y - 3.2}`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="74" y={y - 4} width={width} height="8" rx="4" fill="var(--text-soft)" opacity="0.35" />
        </g>
      ))}
    </g>
  );
}

/** Four-quadrant game board with a glowing centre - reads as "Simon". */
function GameArt({ seed = 0 }) {
  const colors = ["#22c55e", "#ef4444", "#eab308", "var(--brand-blue)"];
  const lit = seed % 4;
  const quads = [
    { x: 0, y: 0 },
    { x: 98, y: 0 },
    { x: 0, y: 98 },
    { x: 98, y: 98 },
  ].map((pos, index) => ({ ...pos, fill: colors[index], active: index === lit }));

  return (
    <g>
      <rect x="20" y="10" width="120" height="16" rx="8" fill="var(--surface-tag)" />
      <rect x="300" y="10" width="80" height="16" rx="8" fill="var(--accent)" opacity="0.22" />

      <g transform="translate(106,32)">
        {quads.map((q) => (
          <rect
            key={`${q.x}-${q.y}`}
            x={q.x}
            y={q.y}
            width="90"
            height="90"
            rx="16"
            fill={q.fill}
            opacity={q.active ? 1 : 0.7}
          />
        ))}
        <circle cx="94" cy="94" r="32" fill="var(--bg)" />
        <circle cx="94" cy="94" r="32" fill="none" stroke="var(--accent)" strokeWidth="3" opacity="0.85" />
      </g>
    </g>
  );
}
