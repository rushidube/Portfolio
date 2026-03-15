export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">
            Where I built my foundations.
          </p>
        </div>

        <div className="timeline">

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-year">2022 – Present</span>
              <h3>B.E. in Computer Engineering</h3>
              <p className="timeline-place">
                Savitribai Phule Pune University
              </p>
              <p>
                Studying core subjects including Data Structures & Algorithms,
                DBMS, Operating Systems, Computer Networks, and Web Technologies
                while building academic and personal projects.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-year">2021 – 2022</span>
              <h3>Higher Secondary</h3>
              <p className="timeline-place">
                Niwasi Highschool Barashiv  
              </p>
              <p>
                Focused on Mathematics and Physics, building strong analytical
                thinking and early programming foundations.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-year">2020-2021</span>
              <h3>Secondary School</h3>
              <p className="timeline-place">
                Niwasi Highschool Barashiv
              </p>
              <p>
                Completed secondary education with focus on Mathematics and Science,
                developing analytical thinking and problem-solving skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}