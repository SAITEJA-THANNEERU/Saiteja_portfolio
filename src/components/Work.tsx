import { useEffect, useState } from "react";
import { FiCheck, FiGithub, FiArrowUpRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../config";
import "./styles/Work.css";

gsap.registerPlugin(ScrollTrigger);

const projectFeatures: Record<number, string[]> = {
  1: [
    "AI Trust Analysis",
    "Security Verification",
    "Risk Scoring",
  ],
  2: [
    "Game Upload & Management",
    "ZIP Extraction & Hosting",
    "In-Browser Game Player",
  ],
  3: [
    "Mystery Card Gameplay",
    "Dynamic Scoring System",
    "Multiple Game Rounds",
  ],
  4: [
    "Tenant Management",
    "Rent & Payment Tracking",
    "Notifications",
  ],
  5: [
    "Calorie Prediction",
    "Fitness Analytics",
    "Interactive Dashboard",
  ],
};

const Work = () => {
  const projects = config.projects.slice(0, 5);

  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    const projectElements =
      gsap.utils.toArray<HTMLElement>(".work-project-card");

    projectElements.forEach((element, index) => {
      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top 48%",
        end: "bottom 48%",

        onEnter: () => {
          setActiveProject(index);
        },

        onEnterBack: () => {
          setActiveProject(index);
        },
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="work-section" id="work">
      <div className="work-container section-container">

        {/* HEADER */}
        <div className="work-header">
          <span className="work-eyebrow">
            <span>✦</span>
            MY WORK
          </span>

          <h2>
            Featured <span>Projects</span>
          </h2>

          <p>
            A selection of my recent work across AI, Full Stack,
            and Web Applications.
          </p>
        </div>

        {/* PROJECTS */}
        <div className="work-projects">

          {projects.map((project, index) => {
            const isActive = activeProject === index;

            const features =
              projectFeatures[project.id] || [
                "Modern Application",
                "Responsive Interface",
                "Practical Solution",
              ];

            return (
              <article
                key={project.id}
                className={`work-project-card ${
                  isActive ? "is-active" : ""
                }`}
              >

                {/* =========================
                    ACTIVE / LARGE PROJECT
                ========================== */}

                {isActive ? (
                  <div className="active-project">

                    <div className="active-project-content">

                      <div className="featured-label">
                        <span>✦</span>
                        FEATURED PROJECT
                      </div>

                      <div className="project-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="active-project-title">
                        <h3>{project.title}</h3>

                        <span>
                          {project.category}
                        </span>
                      </div>

                      <p className="active-project-description">
                        {project.description}
                      </p>

                      {/* FEATURES */}
                      <div className="project-features">
                        {features.map((feature) => (
                          <div
                            className="project-feature"
                            key={feature}
                          >
                            <span className="feature-icon">
                              <FiCheck />
                            </span>

                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* TECH STACK */}
                      <div className="project-stack">
                        <span className="stack-label">
                          Tech Stack
                        </span>

                        <div className="stack-list">
                          {project.technologies
                            .split(" • ")
                            .map((technology) => (
                              <span
                                className="stack-pill"
                                key={technology}
                              >
                                {technology}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* GITHUB */}
                      <div className="project-actions">
                        <a
                          href="https://github.com/SAITEJA-THANNEERU"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="github-button"
                          data-cursor="disable"
                        >
                          <FiGithub />

                          <span>
                            View on GitHub
                          </span>

                          <FiArrowUpRight />
                        </a>
                      </div>

                    </div>

                    {/* IMAGE */}
                    <div className="active-project-image">
                      <img
                        src={project.image}
                        alt={project.title}
                      />
                    </div>

                  </div>
                ) : (

                  /* =========================
                     INACTIVE / SMALL PROJECT
                  ========================== */

                  <div className="inactive-project">

                    <div className="inactive-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="inactive-image">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                      />
                    </div>

                    <div className="inactive-info">

                      <h3>
                        {project.title}
                      </h3>

                      <span className="inactive-category">
                        {project.category}
                      </span>

                      <p>
                        {project.description}
                      </p>

                    </div>

                    <a
                      href="https://github.com/SAITEJA-THANNEERU"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inactive-github"
                      aria-label={`View ${project.title} on GitHub`}
                      data-cursor="disable"
                    >
                      <FiGithub />
                    </a>

                  </div>
                )}

              </article>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default Work;