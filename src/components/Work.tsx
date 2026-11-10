import { useEffect, useMemo, useState } from "react";
import {
  FiGithub,
  FiArrowUpRight,
  FiGrid,
  FiCpu,
  FiCode,
  FiSmartphone,
  FiBarChart2,
  FiX,
} from "react-icons/fi";

import { config } from "../config";
import "./styles/Work.css";

type Category = "All" | "AI / ML" | "Full Stack" | "Mobile" | "Data";

const categories: {
  name: Category;
  icon: React.ReactNode;
}[] = [
  { name: "All", icon: <FiGrid /> },
  { name: "AI / ML", icon: <FiCpu /> },
  { name: "Full Stack", icon: <FiCode /> },
  { name: "Mobile", icon: <FiSmartphone /> },
  { name: "Data", icon: <FiBarChart2 /> },
];

const projectCategories: Record<number, Category[]> = {
  1: ["AI / ML", "Full Stack"],
  2: ["Full Stack"],
  3: ["Full Stack"],
  4: ["Mobile"],
  5: ["AI / ML", "Data"],
  6: ["AI / ML"],
  7: ["AI / ML"],
  8: ["AI / ML"],
  9: ["Full Stack", "Data"],
};

const githubUrl = "https://github.com/SAITEJA-THANNEERU";

const Work = () => {
  const [activeCategory, setActiveCategory] =
    useState<Category>("All");

  const [selectedProject, setSelectedProject] =
    useState<(typeof config.projects)[number] | null>(null);

  const projects = useMemo(() => {
    return config.projects.filter((project) => {
      if (activeCategory === "All") return true;

      return projectCategories[project.id]?.includes(activeCategory);
    });
  }, [activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      All: config.projects.length,
      "AI / ML": 0,
      "Full Stack": 0,
      Mobile: 0,
      Data: 0,
    };

    config.projects.forEach((project) => {
      projectCategories[project.id]?.forEach((category) => {
        counts[category]++;
      });
    });

    return counts;
  }, []);

  // Close modal using Escape and prevent background scrolling.
  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  const openProject = (project: (typeof config.projects)[number]) => {
    setSelectedProject(project);
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  return (
    <section className="work-section" id="work">
      <div className="work-container section-container">

        {/* HEADER */}
        <div className="work-header">
          <div className="work-heading-content">
            <span className="work-eyebrow">
              <span className="work-eyebrow-icon">✦</span>
              MY WORK
            </span>

            <h2 className="work-title">
              My <span>Projects</span>
            </h2>

            <p className="work-description">
              A collection of projects showcasing my work across
              software engineering, artificial intelligence,
              data analytics, and web development.
            </p>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="work-filters">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`work-filter ${
                  activeCategory === category.name ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category.name)}
                type="button"
                aria-pressed={activeCategory === category.name}
              >
                <span className="filter-icon">{category.icon}</span>
                <span>{category.name}</span>
                <span className="filter-count">
                  {categoryCounts[category.name]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* PROJECT GRID */}
        <div className="work-projects">
          {projects.map((project) => {
            const technologies = project.technologies
              .split(" • ")
              .map((technology) => technology.trim());

            return (
              <article
                key={project.id}
                className="work-project-card"
                role="button"
                tabIndex={0}
                aria-label={`Open ${project.title} project details`}
                onClick={() => openProject(project)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openProject(project);
                  }
                }}
              >
                <div className="project-image-wrapper">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-card-image"
                    loading="lazy"
                  />

                  <span className="project-card-number">
                    {String(project.id).padStart(2, "0")}
                  </span>

                  <span className="project-expand-hint">
                    <FiArrowUpRight />
                  </span>
                </div>

                <div className="project-card-content">
                  <div className="project-card-heading">
                    <h3 className="project-card-title">
                      {project.title}
                    </h3>

                    <span className="project-card-category">
                      {project.category}
                    </span>
                  </div>

                  <p className="project-card-description">
                    {project.description}
                  </p>

                  <div className="project-card-technologies">
                    {technologies.map((technology) => (
                      <span
                        key={technology}
                        className="project-tech-badge"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>

                  <div className="project-card-actions">
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-github-button"
                      aria-label={`View ${project.title} on GitHub`}
                      data-cursor="disable"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <FiGithub />
                      <span>View on GitHub</span>
                      <FiArrowUpRight />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="work-empty-state">
            No projects found in this category.
          </div>
        )}
      </div>

      {/* =====================================================
          PROJECT FOCUS MODAL
         ===================================================== */}

      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeProject();
            }
          }}
        >
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            {/* CLOSE BUTTON */}
            <button
              className="project-modal-close"
              type="button"
              onClick={closeProject}
              aria-label="Close project details"
              autoFocus
            >
              <FiX />
            </button>

            {/* LARGE PROJECT IMAGE */}
            <div className="project-modal-image-wrapper">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="project-modal-image"
              />

              <span className="project-modal-number">
                PROJECT {String(selectedProject.id).padStart(2, "0")}
              </span>
            </div>

            {/* PROJECT INFORMATION */}
            <div className="project-modal-content">
              <span className="project-modal-category">
                {selectedProject.category}
              </span>

              <h2 id="project-modal-title">
                {selectedProject.title}
              </h2>

              <p className="project-modal-description">
                {selectedProject.description}
              </p>

              <div className="project-modal-divider" />

              <h3 className="project-modal-tech-heading">
                Technologies Used
              </h3>

              <div className="project-modal-technologies">
                {selectedProject.technologies
                  .split(" • ")
                  .map((technology) => technology.trim())
                  .map((technology) => (
                    <span
                      key={technology}
                      className="project-tech-badge"
                    >
                      {technology}
                    </span>
                  ))}
              </div>

              <div className="project-modal-actions">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-github"
                >
                  <FiGithub />
                  View on GitHub
                  <FiArrowUpRight />
                </a>

                <button
                  type="button"
                  className="project-modal-back"
                  onClick={closeProject}
                >
                  Back to Projects
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Work;