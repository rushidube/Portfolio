import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">

        <div className="footer-info">
          <p><FaEnvelope /> rushikeshdube3@gmail.com</p>
          <p><FaMapMarkerAlt /> Pune, India</p>
        </div>

        <div className="footer-social">
          <a
            href="https://github.com/rushidube"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub /> GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/rushikesh-dube-b6485a257/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin /> LinkedIn
          </a>
        </div>

      </div>
    </footer>
  );
}