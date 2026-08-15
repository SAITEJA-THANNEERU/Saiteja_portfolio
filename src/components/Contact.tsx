import {
  FaArrowRight,
  FaArrowUp,
  FaCalendarCheck,
  FaChartLine,
  FaCode,
  FaCopy,
  FaDatabase,
  FaEnvelope,
  FaGithub,
  FaHandshake,
  FaInstagram,
  FaLinkedinIn,
  FaLocationDot,
  FaPaperPlane,
  FaPhone,
  FaShareNodes,
  FaUsers,
  FaXTwitter,
  FaAward,
} from "react-icons/fa6";
import { useState } from "react";
import "./styles/Contact.css";
import { config } from "../config";

const Contact = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);

      window.setTimeout(() => {
        setCopied(null);
      }, 1800);
    } catch {
      setCopied(null);
    }
  };
const socialLinks = [
  {
    name: "GitHub",
    href: config.contact.github,
    icon: <FaGithub />,
  },
  {
    name: "LinkedIn",
    href: config.contact.linkedin,
    icon: <FaLinkedinIn />,
  },
  {
    name: "Twitter / X",
    href: config.contact.twitter,
    icon: <FaXTwitter />,
  },
  {
    name: "Credly",
    href: config.contact.credly,
    icon: <FaAward />,
  },
  {
    name: "Instagram",
    href: config.contact.instagram,
    icon: <FaInstagram />,
  },
];
  return (
    <section className="contact-section" id="contact">
      <div className="contact-background-glow contact-background-glow-one" />
      <div className="contact-background-glow contact-background-glow-two" />

      <div className="contact-container">
        {/* =========================
            HERO / INTRO
        ========================== */}

        <div className="contact-intro">
          <div className="contact-intro-content">
            <div className="contact-eyebrow">
              <span className="contact-eyebrow-dot" />
              <span>GET IN TOUCH</span>
            </div>

            <h2 className="contact-name">
              <span>SAI TEJA</span>

              <span className="contact-name-gradient">
                THANNEERU
              </span>
            </h2>

            <p className="contact-description">
              AI Engineer and Data Analyst passionate about
              building intelligent solutions and turning data
              into meaningful insights.
            </p>
          </div>

          <div className="contact-world">
            <div className="world-map">
              <span className="world-map-dot dot-one" />
              <span className="world-map-dot dot-two" />
              <span className="world-map-dot dot-three" />
              <span className="world-map-dot dot-four" />
              <span className="world-map-dot dot-five" />
            </div>

            <div className="contact-signature">
              Let's Connect!
            </div>
          </div>
        </div>

        {/* =========================
            MAIN CONTACT GRID
        ========================== */}

        <div className="contact-grid">

          {/* CONTACT INFO */}

          <div className="contact-column">
            <div className="contact-column-title">
              <FaUsers />
              <span>CONTACT INFO</span>
            </div>

            <div className="contact-info-list">

              {/* EMAIL */}

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <FaEnvelope />
                </div>

                <div className="contact-info-content">
                  <span className="contact-info-label">
                    Email
                  </span>

                  <a
                    href={`mailto:${config.contact.email}`}
                    data-cursor="disable"
                  >
                    {config.contact.email}
                  </a>
                </div>

                <button
                  type="button"
                  className="contact-copy-button"
                  onClick={() =>
                    copyToClipboard(
                      config.contact.email,
                      "email"
                    )
                  }
                  aria-label="Copy email"
                >
                  <FaCopy />
                </button>

                {copied === "email" && (
                  <span className="copy-status">
                    Copied
                  </span>
                )}
              </div>

              {/* PHONE */}

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <FaPhone />
                </div>

                <div className="contact-info-content">
                  <span className="contact-info-label">
                    Phone
                  </span>

                  <a
                    href={`tel:${config.contact.phone}`}
                    data-cursor="disable"
                  >
                    {config.contact.phone}
                  </a>
                </div>

                <button
                  type="button"
                  className="contact-copy-button"
                  onClick={() =>
                    copyToClipboard(
                      config.contact.phone,
                      "phone"
                    )
                  }
                  aria-label="Copy phone number"
                >
                  <FaCopy />
                </button>

                {copied === "phone" && (
                  <span className="copy-status">
                    Copied
                  </span>
                )}
              </div>

              {/* LOCATION */}

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <FaLocationDot />
                </div>

                <div className="contact-info-content">
                  <span className="contact-info-label">
                    Location
                  </span>

                  <span>
                    {config.social.location}
                  </span>
                </div>

                <button
                  type="button"
                  className="contact-copy-button"
                  onClick={() =>
                    copyToClipboard(
                      config.social.location,
                      "location"
                    )
                  }
                  aria-label="Copy location"
                >
                  <FaCopy />
                </button>

                {copied === "location" && (
                  <span className="copy-status">
                    Copied
                  </span>
                )}
              </div>

              {/* AVAILABILITY */}

              <div className="contact-info-card availability-card">
                <div className="contact-info-icon">
                  <FaCalendarCheck />
                </div>

                <div className="contact-info-content">
                  <span className="contact-info-label">
                    Availability
                  </span>

                  <span>
                    Open to Opportunities
                  </span>
                </div>

                <span
                  className="availability-indicator"
                  aria-label="Available"
                />
              </div>

            </div>

            {/* MESSAGE BUTTON */}

            <a
              href={`mailto:${config.contact.email}`}
              className="contact-message-button"
              data-cursor="disable"
            >
              <FaPaperPlane />

              <span>
                Send Me a Message
              </span>

              <FaArrowRight />
            </a>
          </div>

          {/* =========================
              SOCIAL LINKS
          ========================== */}

          <div className="contact-column">

            <div className="contact-column-title">
              <FaShareNodes />
              <span>CONNECT WITH ME</span>
            </div>

            <div className="contact-social-list">

              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href || "#"}
                  target={
                    social.href
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    social.href
                      ? "noopener noreferrer"
                      : undefined
                  }
                  data-cursor="disable"
                  className={`contact-social-card ${
                    !social.href
                      ? "contact-social-disabled"
                      : ""
                  }`}
                  onClick={(event) => {
                    if (!social.href) {
                      event.preventDefault();
                    }
                  }}
                  aria-label={`Open ${social.name}`}
                >

                  {/* ICON */}

                  <span className="social-card-icon">
                    {social.icon}
                  </span>

                  {/* PLATFORM NAME ONLY */}

                  <span className="social-card-name">
                    {social.name}
                  </span>

                  {/* ARROW */}

                  <FaArrowRight className="social-card-arrow" />

                </a>
              ))}

            </div>
          </div>

          {/* =========================
              CTA
          ========================== */}

          <div className="contact-column contact-cta-column">

            <div className="contact-column-title">
              <FaHandshake />
              <span>
                LET'S WORK TOGETHER
              </span>
            </div>

            <div className="contact-cta-card">

              <div className="contact-cta-content">

                <p>
                  I'm always open to discussing new
                  opportunities, interesting projects, or
                  just having a chat about AI, data, and
                  tech.
                </p>

                <div className="contact-cta-divider" />

                <strong>
  Let's work
  <br />
  together!
</strong>
              </div>

              <div className="contact-handshake">
                <div className="handshake-glow" />
                <FaHandshake />
              </div>

            </div>

            {/* STATS */}

            <div className="contact-stats">

              <div className="contact-stat">
                <FaCode />
                <strong>10+</strong>
                <span>Projects</span>
              </div>

              <div className="contact-stat">
                <FaChartLine />
                <strong>3+</strong>
                <span>Years Learning</span>
              </div>

              <div className="contact-stat">
                <FaDatabase />
                <strong>15+</strong>
                <span>Technologies</span>
              </div>

              <div className="contact-stat">
                <FaUsers />
                <strong>100%</strong>
                <span>Dedication</span>
              </div>

            </div>
          </div>
        </div>

        {/* =========================
            FOOTER
        ========================== */}

        <div className="contact-footer">

          <div className="contact-footer-left">

            <div className="contact-monogram">
  <img
    src="/images/mypicnbg.png"
    alt={config.developer.fullName}
    className="contact-footer-profile"
  />
</div>

            <p>
              © {new Date().getFullYear()}{" "}
              {config.developer.fullName
                .split(" ")
                .map(
                  (name) =>
                    name.charAt(0).toUpperCase() +
                    name.slice(1).toLowerCase()
                )
                .join(" ")}
              . All rights reserved.
            </p>

          </div>

          <button
            type="button"
            className="back-to-top"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <FaArrowUp />
            <span>Back to Top</span>
          </button>

        </div>
      </div>
    </section>
  );
};

export default Contact;