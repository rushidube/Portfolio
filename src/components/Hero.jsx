import { useEffect, useState } from "react";

export default function Hero() {
  const roles = [
    "Full-Stack Developer",
    "React • Node • Express • SQL",
    "Data Analyst",
    "Excel • Power BI • Python • NumPy • Pandas"
  ];

  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout;

    if (!deleting) {
      timeout = setTimeout(() => {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1200);
        }
      }, 80);
    } else {
      timeout = setTimeout(() => {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }, 50);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex]);

  return (
    <section id="home" className="section hero">
      <div className="container hero-grid">

        {/* LEFT - Avatar */}
        <div className="hero-media">
          <div className="hero-avatar-wrap">
            <div className="hero-avatar-glow"></div>
            <img
              src="/myphoto.jpeg"
              alt="Rushikesh Dube"
              className="hero-avatar"
            />
          </div>

          <div className="hero-tag-card">
            JavaScript | React.js | Node.js | Express.js | MongoDB | SQL
          </div>
        </div>

        {/* RIGHT - Text */}
        <div className="hero-text">
          <p className="hero-kicker">HEY, WELCOME TO MY PORTFOLIO 👋</p>

          <h1 className="hero-title">
            I'm <span className="accent">Rushikesh</span>
          </h1>

          <h2 className="hero-subtitle">
            <span className="subtitle-dynamic">{text}</span>
            <span className="cursor"></span>
          </h2>

          <p className="hero-description">
            I build modern, responsive web applications using clean code,
            thoughtful design, and performance optimization to deliver great
            user experiences.
          </p>

          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">
              Hire Me
            </a>

            <a
              href="/Rushikesh_Dube.pdf"
              className="btn btn-primary"
              download
            >
              Download Resume
            </a>

            <a
              href="https://github.com/rushidube"
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-github"></i> GitHub
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}