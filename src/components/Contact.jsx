import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Check, Loader2, RotateCcw, Send } from "lucide-react";

import { SPRING, fadeUp, makeStagger, scaleIn } from "../lib/animations";
import { useToast } from "../lib/toast";
import AnimatedText from "./ui/AnimatedText";
import MagneticButton from "./ui/MagneticButton";
import Reveal from "./ui/Reveal";

const FORM_ENDPOINT = "https://formspree.io/f/xvzbnevg";

const fieldStagger = makeStagger(0.1, 0.1);

const FIELDS = [
  { name: "name", type: "text", placeholder: "Your Name", label: "Your name" },
  { name: "email", type: "email", placeholder: "Your Email", label: "Your email address" },
  {
    name: "message",
    placeholder: "Your Message",
    label: "Your message",
    textarea: true,
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Friendly, specific copy instead of a generic "This field is required". */
function validateField(name, rawValue) {
  const value = rawValue.trim();

  if (name === "name") {
    if (!value) return "Let me know who's reaching out.";
    if (value.length < 2) return "That name looks a little short.";
  }

  if (name === "email") {
    if (!value) return "I'll need an email to reply to.";
    if (!EMAIL_PATTERN.test(value)) return "That email address doesn't look right.";
  }

  if (name === "message") {
    if (!value) return "Add a quick note so I know why you're reaching out.";
    if (value.length < 10) return "A few more details would help me respond well.";
  }

  return null;
}

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const fieldRefs = useRef({});
  const { showToast } = useToast();

  const sending = status === "sending";

  function handleChange(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Once a field has been touched, re-validate on every keystroke so the
    // error clears the moment it's fixed instead of waiting for another blur.
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  }

  function handleBlur(name) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, values[name]) }));
  }

  /**
   * Submits in the background instead of navigating away to Formspree's own
   * confirmation page, which is what makes an inline success state possible.
   * The endpoint, method and field names are unchanged. Built from `values`
   * rather than reading the DOM form, so the exact same function can retry a
   * failed send from a toast action without needing a live form element.
   *
   * If the request fails for any reason the visitor is told twice - inline,
   * with a way to retry right there, and via toast - and given the email
   * address directly, so a message is never silently lost.
   */
  async function submit(submitValues) {
    setStatus("sending");

    try {
      const formData = new FormData();
      formData.append("name", submitValues.name);
      formData.append("email", submitValues.email);
      formData.append("message", submitValues.message);

      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Submission rejected");

      setValues({ name: "", email: "", message: "" });
      setTouched({});
      setErrors({});
      setStatus("success");
      showToast({ variant: "success", message: "Message sent - I'll get back to you soon." });
    } catch {
      setStatus("error");
      showToast({
        variant: "error",
        message: "Couldn't send your message. Check your connection and try again.",
        action: { label: "Retry", onClick: () => submit(submitValues) },
      });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = Object.fromEntries(
      FIELDS.map((field) => [field.name, validateField(field.name, values[field.name])]),
    );
    setErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });

    const firstInvalid = FIELDS.find((field) => nextErrors[field.name]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid.name]?.focus();
      return;
    }

    submit(values);
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="contact-spotlight"></div>

      <div className="container contact-inner">
        <AnimatedText as="h2" className="contact-title" text="Contact Me!" />
        <p className="contact-subtitle">
          Open to Data Analyst and Power BI Developer roles - reach out and let's talk.
        </p>

        <Reveal
          as="form"
          className="contact-form"
          variants={fieldStagger}
          amount={0.2}
          action={FORM_ENDPOINT}
          method="POST"
          noValidate
          onSubmit={handleSubmit}
        >
          {FIELDS.map((field) => (
            <Field
              key={field.name}
              field={field}
              value={values[field.name]}
              error={touched[field.name] ? errors[field.name] : null}
              disabled={sending}
              onChange={(value) => handleChange(field.name, value)}
              onBlur={() => handleBlur(field.name)}
              inputRef={(el) => (fieldRefs.current[field.name] = el)}
            />
          ))}

          <motion.div variants={fadeUp} layout="position">
            <MagneticButton
              type="submit"
              className="contact-btn"
              disabled={sending}
              data-status={status}
            >
              {/*
                The label swaps in place rather than the button resizing around
                it, so the control never jumps under the cursor mid-click.
              */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status}
                  className="contact-btn-label"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  {status === "success" ? (
                    <>
                      <Check size={16} aria-hidden="true" /> Message Sent
                    </>
                  ) : sending ? (
                    <>
                      <Loader2 size={16} className="spin" aria-hidden="true" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden="true" /> Send Message
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </MagneticButton>
          </motion.div>

          {/* `role="status"` announces the outcome to screen readers without
              stealing focus from the form. */}
          <div className="contact-status" role="status" aria-live="polite">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.p
                  key="success"
                  className="contact-status-success"
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <motion.span
                    className="contact-status-icon"
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={SPRING}
                  >
                    <Check size={14} aria-hidden="true" />
                  </motion.span>
                  Thanks for reaching out — I’ll get back to you soon.
                </motion.p>
              ) : null}

              {status === "error" ? (
                <motion.div
                  key="error"
                  className="contact-status-error"
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <p>
                    Something went wrong. Please try again, or email me directly at
                    rushikeshdube3@gmail.com.
                  </p>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm contact-retry-btn"
                    onClick={() => submit(values)}
                  >
                    <RotateCcw size={13} aria-hidden="true" />
                    Try Again
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * A single form control.
 *
 * The stylesheet already glows the border on `:focus`; this adds a matching
 * ring that scales in behind the field, so focus is impossible to miss for
 * keyboard users without changing the input's own appearance. Validation is
 * driven entirely by `aria-invalid` + `aria-describedby`, so the error styling
 * and the accessible wiring can never drift apart.
 */
function Field({ field, value, error, disabled, onChange, onBlur, inputRef }) {
  const [focused, setFocused] = useState(false);
  const Tag = field.textarea ? "textarea" : "input";
  const inputId = `contact-${field.name}`;
  const errorId = `${inputId}-error`;

  return (
    <motion.div className="form-group" variants={fadeUp} layout="position">
      <label className="sr-only" htmlFor={inputId}>
        {field.label}
      </label>
      <Tag
        ref={inputRef}
        id={inputId}
        type={field.textarea ? undefined : field.type}
        name={field.name}
        rows={field.textarea ? 5 : undefined}
        placeholder={field.placeholder}
        value={value}
        required
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur();
        }}
      />
      <motion.span
        className="form-focus-ring"
        aria-hidden="true"
        initial={false}
        animate={{ opacity: focused ? 1 : 0, scale: focused ? 1 : 0.98 }}
        transition={{ duration: 0.2 }}
      />

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={errorId}
            className="form-error"
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle size={13} aria-hidden="true" />
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
