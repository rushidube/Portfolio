export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Skills</h2>
          <p className="section-subtitle">
           Technologies and tools I use to develop and build projects.
          </p>
        </div>

        <div className="skills-grid">

          <div className="skill-group">
            <h3>Frontend</h3>
            <div className="skill-tags">
              <span className="skill-pill">HTML5</span>
              <span className="skill-pill">CSS3</span>
              <span className="skill-pill">JavaScript</span>
              <span className="skill-pill">React.js</span>
              <span className="skill-pill">Responsive Design</span>
              <span className="skill-pill">Bootstrap</span>
            </div>
          </div>

          <div className="skill-group">
            <h3>Backend</h3>
            <div className="skill-tags">
              <span className="skill-pill">Node.js</span>
              <span className="skill-pill">Express.js</span>
              <span className="skill-pill">REST APIs</span>
            </div>
          </div>
          
          <div className="skill-group">
              <h3>Data Analysis</h3>
              <div className="skill-tags">
                 <span className="skill-pill">Python</span>
                 <span className="skill-pill">NumPy</span>
                 <span className="skill-pill">Pandas</span>
              </div>
          </div>

          <div className="skill-group">
            <h3>Programming & Logic</h3>
            <div className="skill-tags">
              <span className="skill-pill">Java</span>
              <span className="skill-pill">Data Structure & Algorithms</span>
              <span className="skill-pill">Problem Solving</span>
            </div>
          </div>

          <div className="skill-group">
            <h3>Tools</h3>
            <div className="skill-tags">
              <span className="skill-pill">VS Code</span>
              <span className="skill-pill">Git</span>
              <span className="skill-pill">GitHub</span>
              <span className="skill-pill">Postman</span>
             <span className="skill-pill">MS Excel</span>
              <span className="skill-pill">PowerBI</span>
            </div>
          </div>

          <div className="skill-group">
            <h3>Soft Skills</h3>
            <div className="skill-tags">
              <span className="skill-pill">Teamwork</span>
              <span className="skill-pill">Time Management</span>
              <span className="skill-pill">Communication</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}