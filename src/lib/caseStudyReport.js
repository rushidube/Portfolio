/**
 * Turns a project's case study data into a plain-text Markdown report and
 * triggers a real client-side download - no server, no fake asset link.
 *
 * "Download Report" on a project that has no PDF anywhere would either be a
 * dead link or a fabricated file; this generates the report from the exact
 * data already rendered in the drawer, so what downloads always matches what
 * was shown.
 */
export function buildCaseStudyMarkdown(project) {
  const lines = [];
  const heading = (text) => lines.push(`\n## ${text}\n`);

  lines.push(`# ${project.title} - Case Study`);
  lines.push(`\n*${project.domain} · ${project.timeframe} · ${project.status}*\n`);
  lines.push(project.summary ?? project.tagline);

  heading("Overview");
  lines.push(`- **Role:** ${project.role}`);
  lines.push(`- **Timeline:** ${project.timeframe}`);
  lines.push(`- **Status:** ${project.status}`);
  if (project.live) lines.push(`- **Live:** ${project.live}`);
  lines.push(`- **Source:** ${project.github}`);

  heading("Business Problem");
  lines.push(`**What:** ${project.problem}`);
  lines.push(`\n**Who was affected:** ${project.who}`);
  lines.push(`\n**Why it mattered:** ${project.why}`);

  if (project.dataset) {
    heading("Dataset");
    const d = project.dataset;
    lines.push(`- **Source:** ${d.source}`);
    lines.push(`- **Rows:** ${d.rows}`);
    lines.push(`- **Columns:** ${d.columns}`);
    lines.push(`- **Size:** ${d.size}`);
    lines.push(`- **Missing values:** ${d.missing}`);
    lines.push(`\n**Cleaning steps:**`);
    d.cleaning.forEach((step) => lines.push(`- ${step}`));
  }

  heading("Workflow");
  project.workflow.forEach((step, index) => {
    lines.push(`${index + 1}. **${step.label}** - ${step.description}`);
  });

  heading("Technology Stack");
  lines.push(project.tech.join(", "));

  heading("Key Insights");
  project.insights.forEach((insight) => {
    lines.push(`- **${insight.title}** - ${insight.description}`);
  });

  heading("Business Impact");
  project.impactStats.forEach((stat) => {
    lines.push(`- **${stat.value} ${stat.label}** - ${stat.description}`);
  });

  heading("Links");
  if (project.live) lines.push(`- Live Demo: ${project.live}`);
  lines.push(`- GitHub: ${project.github}`);

  return lines.join("\n");
}

/** Builds the report and hands the browser a real .md file to save. */
export function downloadCaseStudyReport(project) {
  const markdown = buildCaseStudyMarkdown(project);
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${project.id}-case-study.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
