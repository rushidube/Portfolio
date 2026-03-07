export default function Projects() {
  const projects = [
    {
      title: "Personal Portfolio Website",
      description:
        "A fully responsive personal portfolio built using modern UI principles, smooth animations, and an optimized layout to showcase projects, skills, and experience.",
      tech: ["React.js", "CSS3", "JavaScript"],
      github: "https://github.com/rushidube",
      live: "#",
    },
    {
      title: "Responsive Landing Page",
      description:
        "Designed and developed a responsive landing page focusing on layout structure, typography hierarchy, and cross-device compatibility.",
      tech: ["HTML", "CSS"],
      github: "https://github.com/rushidube",
      live: "#",
    },
   {
  title: "Simon-Memory-Game",
  description:
    "Generates random color sequences that players must memorize and reproduce, featuring animations, sound effects, level progression, and high-score tracking using localStorage.",
  tech: ["JavaScript", "HTML5", "DOM Manipulation", "CSS3"],
  github: "https://github.com/rushidube/Simon-Memory-Game",
  live: "https://rushidube.github.io/Simon-Memory-Game/",
},
  ];

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">
            A few things I’ve built and experimented with.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div className="project-card" key={index}>
              <div className="project-inner">
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <div className="project-tags">
                    {project.tech.map((item, i) => (
                      <span key={i}>{item}</span>
                    ))}
                  </div>
                </div>

               <div className="project-links">
                 <a href={project.github} target="_blank" rel="noreferrer">
                   GitHub
                 </a>
                  <a href={project.live} target="_blank" rel="noreferrer">
                  Live
                   </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}