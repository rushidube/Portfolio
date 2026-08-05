import {
  Braces,
  Calculator,
  ChartColumn,
  ChartPie,
  Database,
  Eraser,
  FileSpreadsheet,
  Funnel,
  LayoutDashboard,
  Search,
  Sigma,
  SquareTerminal,
  Target,
  Wrench,
  Zap,
} from "lucide-react";
import {
  SiCss,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiNumpy,
  SiPandas,
  SiPostman,
  SiPython,
  SiReact,
} from "react-icons/si";

export const SKILL_GROUPS = [
  {
    title: "Business Intelligence",
    Icon: ChartColumn,
    skills: [
      { name: "Power BI", Icon: ChartColumn, level: 95, core: true },
      { name: "Excel", Icon: FileSpreadsheet, level: 92, core: true },
      { name: "DAX", Icon: Sigma, level: 85 },
      { name: "Power Query", Icon: Funnel, level: 83 },
    ],
  },
  {
    title: "Data Analytics",
    Icon: ChartPie,
    skills: [
      { name: "Python", Icon: SiPython, level: 90, core: true },
      { name: "Pandas", Icon: SiPandas, level: 85 },
      { name: "NumPy", Icon: SiNumpy, level: 80 },
      { name: "Statistics", Icon: Calculator, level: 82 },
      { name: "Data Cleaning", Icon: Eraser, level: 88 },
      { name: "Data Visualization", Icon: ChartPie, level: 87 },
    ],
  },
  {
    title: "Databases",
    Icon: Database,
    skills: [
      { name: "SQL", Icon: Database, level: 93, core: true },
      { name: "MySQL", Icon: SiMysql, level: 80 },
      { name: "MongoDB", Icon: SiMongodb, level: 65 },
    ],
  },
  {
    title: "Development",
    Icon: Braces,
    tier: "secondary",
    skills: [
      { name: "React", Icon: SiReact, level: 75 },
      { name: "JavaScript", Icon: SiJavascript, level: 78 },
      { name: "Node.js", Icon: SiNodedotjs, level: 65 },
      { name: "HTML", Icon: SiHtml5, level: 85 },
      { name: "CSS", Icon: SiCss, level: 82 },
    ],
  },
  {
    title: "Tools",
    Icon: Wrench,
    tier: "secondary",
    skills: [
      { name: "Git", Icon: SiGit, level: 85 },
      { name: "GitHub", Icon: SiGithub, level: 88 },
      { name: "VS Code", Icon: SquareTerminal, level: 92 },
      { name: "Postman", Icon: SiPostman, level: 68 },
    ],
  },
];

export const CAPABILITIES = [
  { label: "Dashboard Development", Icon: LayoutDashboard },
  { label: "Data Cleaning", Icon: Eraser },
  { label: "SQL Query Optimization", Icon: Zap },
  { label: "KPI Reporting", Icon: Target },
  { label: "Business Intelligence", Icon: ChartColumn },
  { label: "Exploratory Data Analysis", Icon: Search },
];
