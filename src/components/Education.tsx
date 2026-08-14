import { useEffect, useRef } from "react";
import "./styles/Education.css";

const Education = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  /*
   * ==========================================================
   * EDUCATION DATA
   *
   * Display order:
   *
   * SSC
   * ↓
   * Intermediate
   * ↓
   * B.Tech
   * ==========================================================
   */

  const education = [
    {
      period: "JUN 2019 — APR 2020",
      institution: "Krishnaveni Talent School - India",
      degree: "Secondary Education",
      field: "General",
      skills: [],
      icon: "◇",
      featured: false,
    },

    {
      period: "NOV 2020 — MAY 2022",
      institution: "Sri Kakatiya Junior College",
      degree: "Intermediate",
      field: "MPC",
      skills: ["Mathematical Skills"],
      icon: "◈",
      featured: false,
    },

    {
      period: "NOV 2022 — MAR 2026",
      institution:
        "Malla Reddy College of Engineering & Technology",
      degree: "Bachelor of Technology",
      field: "Computer Science & Engineering",
      skills: [
        "Python",
        "Java",
        "Data Structures",
        "Data Analysis",
      ],
      icon: "🎓",
      featured: true,
    },
  ];

  /*
   * ==========================================================
   * SCROLL REVEAL
   * ==========================================================
   */

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const items =
      section.querySelectorAll<HTMLElement>(
        ".education-item"
      );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(
            "education-item-visible"
          );

          /*
           * Once the item has appeared, we no longer
           * need to observe it.
           */
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    items.forEach((item) => {
      observer.observe(item);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="education-section"
      id="education"
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="education-glow education-glow-one"
        aria-hidden="true"
      />

      <div
        className="education-glow education-glow-two"
        aria-hidden="true"
      />

      <div
        className="education-grid"
        aria-hidden="true"
      />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="education-container">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="education-heading">

          <div className="education-eyebrow">
            <span
              className="education-eyebrow-line"
              aria-hidden="true"
            />

            <span>EDUCATION</span>

            <span
              className="education-eyebrow-line"
              aria-hidden="true"
            />
          </div>

          <h2>
            My academic
            <span>journey</span>
          </h2>

          <p>
            The foundation of knowledge, discipline,
            and problem-solving that shaped the way
            I build, analyze, and create.
          </p>

        </div>

        {/* ===================================================
            TIMELINE
        =================================================== */}

        <div className="education-timeline">

          {/* ===============================================
              DYNAMIC ANIMATED TIMELINE
          =============================================== */}

          <div
            className="education-line"
            aria-hidden="true"
          >
            <div className="education-line-glow" />
          </div>

          {/* ===============================================
              EDUCATION ITEMS
          =============================================== */}

          {education.map((item) => (
            <article
              className={`education-item ${
                item.featured
                  ? "education-item-featured"
                  : ""
              }`}
              key={`${item.institution}-${item.period}`}
            >

              {/* =========================================
                  TIMELINE NODE
              ========================================= */}

              <div
                className="education-node"
                aria-hidden="true"
              />

              {/* =========================================
                  EDUCATION CARD
              ========================================= */}

              <div className="education-card">

                {/* Card glow */}

                <div
                  className="education-card-shine"
                  aria-hidden="true"
                />

                <div className="education-card-content">

                  {/* =====================================
                      TOP ROW
                  ===================================== */}

                  <div className="education-card-top">

                    <div className="education-period">
                      {item.period}
                    </div>

                    <div
                      className="education-icon"
                      aria-hidden="true"
                    >
                      <span>{item.icon}</span>
                    </div>

                  </div>

                  {/* =====================================
                      INSTITUTION
                  ===================================== */}

                  <h3>
                    {item.institution}
                  </h3>

                  {/* =====================================
                      DEGREE
                  ===================================== */}

                  <div className="education-degree">
                    {item.degree}
                  </div>

                  {/* =====================================
                      FIELD
                  ===================================== */}

                  <div className="education-field">
                    {item.field}
                  </div>

                  {/* =====================================
                      DIVIDER
                  ===================================== */}

                  <div
                    className="education-divider"
                    aria-hidden="true"
                  >
                    <span />
                  </div>

                  {/* =====================================
                      SKILLS
                  ===================================== */}

                  {item.skills.length > 0 && (
                    <div className="education-skills">

                      <span className="education-skills-label">
                        SKILLS
                      </span>

                      <div className="education-skill-list">

                        {item.skills.map((skill) => (
                          <span
                            className="education-skill"
                            key={skill}
                          >
                            {skill}
                          </span>
                        ))}

                      </div>

                    </div>
                  )}

                  {/* =====================================
                      FEATURED / B.TECH BADGE
                  ===================================== */}

                  {item.featured && (
                    <div className="education-current-badge">

                      <span
                        className="education-badge-dot"
                        aria-hidden="true"
                      />

                      PRIMARY EDUCATION

                    </div>
                  )}

                </div>
              </div>

            </article>
          ))}

        </div>

        {/* =================================================
            FOOTER STATEMENT
        ================================================= */}

        <div className="education-footer">

          <span
            className="education-footer-line"
            aria-hidden="true"
          />

          <p>
            Learning never stops.
            <span>
              {" "}Every chapter adds something new.
            </span>
          </p>

          <span
            className="education-footer-line"
            aria-hidden="true"
          />

        </div>

      </div>
    </section>
  );
};

export default Education;