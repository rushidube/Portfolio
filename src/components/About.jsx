export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            A short story of how I got into building for the web and working with data.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-text">
            <p>
             I am currently pursuing a Bachelor's degree in Computer Engineering,
             where I am strengthening my analytical thinking and building a solid 
             foundation in core computer science subjects such as Data Structures 
             & Algorithms, DBMS, Operating Systems, and Computer Networks.
            </p>

            <p>
             Growing up in a rapidly evolving technological world, I developed a strong curiosity 
             about how digital systems work behind the scenes. Writing my first lines of HTML and 
             CSS sparked my interest in web development and showed me how powerful the web can
             be—transforming simple ideas into interactive digital experiences.
            </p>

            <p>
              Alongside web development, I developed an interest in data analysis and data-driven 
              decision making. I enjoy working with data to uncover insights, identify patterns, 
              and support meaningful solutions using analytical tools and techniques.
            </p>
          </div>

          <div className="about-highlights">
            <div className="about-card">
              <div className="about-icon">💻</div>
              <div>
                <h3>Programming Languages</h3>
                <p>
                 Comfortable with Java, JavaScript, and Python, with a focus on writing
                  clean, structured and maintainable code.
                </p>
              </div>
            </div>

            <div className="about-card">
              <div className="about-icon">🧠</div>
              <div>
                <h3>Core Fundamentals</h3>
                <p>
                  Basic understanding of DBMS, Operating Systems, Computer
                  Networks, Data Structures and Data Science.
                </p>
              </div>
            </div>

            <div className="about-card">
              <div className="about-icon">🚀</div>
              <div>
                <h3>Problem Solving</h3>
                <p>
                  Actively practicing Data Structures and Algorithms to improve
                  logical thinking and coding efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}