import { Braces, ChartColumn, Database, Table2 } from "lucide-react";
import {
  SiCss,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiMongodb,
  SiNodedotjs,
  SiPandas,
  SiPlotly,
  SiPostgresql,
  SiPython,
  SiReact,
  SiStreamlit,
} from "react-icons/si";

/**
 * One shared tech-badge map for both the project card grid and the case
 * study drawer, so a new tool only ever gets added in one place.
 *
 * Real brand marks where Simple Icons has one; a neutral glyph otherwise
 * (Power BI, SQL and Excel have no official mark in the icon set this
 * project ships).
 */
export const TECH_META = {
  React: { Icon: SiReact },
  JavaScript: { Icon: SiJavascript },
  CSS3: { Icon: SiCss },
  HTML5: { Icon: SiHtml5 },
  Python: { Icon: SiPython },
  Pandas: { Icon: SiPandas },
  Plotly: { Icon: SiPlotly },
  Streamlit: { Icon: SiStreamlit },
  "Node.js": { Icon: SiNodedotjs },
  "Express.js": { Icon: SiExpress },
  PostgreSQL: { Icon: SiPostgresql },
  JWT: { Icon: SiJsonwebtokens },
  "Power BI": { Icon: ChartColumn },
  SQL: { Icon: Database },
  Excel: { Icon: Table2 },
  MongoDB: { Icon: SiMongodb },
  Git: { Icon: SiGit },
  GitHub: { Icon: SiGithub },
};

export const DEFAULT_TECH_ICON = Braces;

export function techIcon(name) {
  return TECH_META[name]?.Icon ?? DEFAULT_TECH_ICON;
}
