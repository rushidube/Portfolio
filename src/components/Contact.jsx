export default function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <div className="contact-spotlight"></div>

      <div className="container contact-inner">
        <h2 className="contact-title">Contact Me!</h2>

        <form
          className="contact-form"
          action="https://formspree.io/f/xvzbnevg"
          method="POST"
        >
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="message"
              rows="5"
              placeholder="Your Message"
              required
            ></textarea>
          </div>

          <button type="submit" className="contact-btn">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}