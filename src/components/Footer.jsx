import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Check, Copy } from "lucide-react";

import { TAP, fadeUp, linkNudge, listReveal, makeStagger, underlineGrow } from "../lib/animations";
import Reveal from "./ui/Reveal";

const EMAIL = "rushikeshdube3@gmail.com";
const footerStagger = makeStagger(0.1, 0.05);

const SOCIALS = [
  { href: "https://github.com/rushidube", label: "GitHub", Icon: FaGithub },
  {
    href: "https://www.linkedin.com/in/rushikeshkdube/",
    label: "LinkedIn",
    Icon: FaLinkedin,
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* The top border is now a real element so it can draw itself across the
          page as the footer arrives, instead of simply being there. */}
      <motion.span
        className="footer-divider"
        variants={underlineGrow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      />

      <Reveal className="container footer-grid" variants={footerStagger} amount={0.3}>
        <motion.div className="footer-info" variants={fadeUp}>
          <CopyEmail />
          <p>
            <FaMapMarkerAlt /> Pune, India
          </p>
        </motion.div>

        <motion.div className="footer-social" variants={footerStagger}>
          {SOCIALS.map(({ href, label, Icon }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              variants={listReveal}
              whileHover={linkNudge}
              whileTap={TAP}
            >
              <Icon /> {label}
            </motion.a>
          ))}
        </motion.div>
      </Reveal>
    </footer>
  );
}

/**
 * Click-to-copy email address.
 *
 * The icon crossfades to a tick for a couple of seconds - enough to confirm the
 * copy happened without the control feeling stuck in a success state. Falls
 * back silently if the Clipboard API is unavailable (older browsers, or any
 * non-secure origin), where the address is still selectable as plain text.
 */
function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(0);

  // Clear the pending reset if the component unmounts mid-countdown.
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard permission - leave the address for manual selection.
    }
  };

  return (
    <motion.button
      type="button"
      className="footer-copy"
      onClick={copy}
      aria-label={copied ? "Email address copied" : `Copy email address ${EMAIL}`}
      whileHover={linkNudge}
      whileTap={TAP}
    >
      <FaEnvelope /> {EMAIL}
      <span className="footer-copy-icon" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "copied" : "idle"}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
