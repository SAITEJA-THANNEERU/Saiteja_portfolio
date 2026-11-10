import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiAward,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiCpu,
  FiBarChart2,
  FiCode,
  FiCloud,
  FiWifi,
  FiDatabase,
  FiX,
} from "react-icons/fi";

import CertificationCard from "./CertificationCard";
import { certifications, Certification } from "../data/certifications";
import "./styles/Certifications.css";

const categoryFilters = [
  { label: "All", value: "All", icon: FiGrid },
  { label: "AI / ML", value: "AI / ML", icon: FiCpu },
  { label: "Data Science", value: "Data Science", icon: FiBarChart2 },
  { label: "Programming", value: "Programming", icon: FiCode },
  { label: "Cloud", value: "Cloud", icon: FiCloud },
  { label: "Networking", value: "Networking", icon: FiWifi },
  { label: "Database", value: "Database", icon: FiDatabase },
];

const matchesCategory = (category: string, filter: string) => {
  if (filter === "All") return true;

  if (filter === "AI / ML") {
    return ["Artificial Intelligence", "AI Agents"].includes(category);
  }

  if (filter === "Cloud") {
    return category === "Cloud Computing";
  }

  return category === filter;
};

const Certifications = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const interactionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeCategory, setActiveCategory] = useState("All");
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certification | null>(null);

  const filteredCertifications = certifications.filter((certification) =>
    matchesCategory(certification.category, activeCategory)
  );

  const updatePages = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const totalPages = Math.max(
      1,
      Math.ceil(
        (container.scrollWidth - container.clientWidth) /
          container.clientWidth
      ) + 1
    );

    setPageCount(totalPages);

    setActivePage((current) =>
      Math.min(current, totalPages - 1)
    );
  }, []);

  const goToPage = useCallback((page: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const nextPage = Math.max(
      0,
      Math.min(page, pageCount - 1)
    );

    container.scrollTo({
      left: nextPage * container.clientWidth,
      behavior: "smooth",
    });

    setActivePage(nextPage);
  }, [pageCount]);

  const pauseAutoScroll = useCallback(() => {
    setIsInteracting(true);

    if (interactionTimeout.current) {
      clearTimeout(interactionTimeout.current);
    }

    interactionTimeout.current = setTimeout(() => {
      setIsInteracting(false);
    }, 4000);
  }, []);

  // Reset carousel when category changes.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({
      left: 0,
      behavior: "instant",
    });

    setActivePage(0);

    requestAnimationFrame(updatePages);
  }, [activeCategory, updatePages]);

  // Recalculate pages on resize.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updatePages();

    const resizeObserver = new ResizeObserver(updatePages);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [updatePages, filteredCertifications.length]);

  // Synchronize pagination with manual scrolling.
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const page = Math.round(
      container.scrollLeft / container.clientWidth
    );

    setActivePage(Math.min(page, pageCount - 1));
  };

  // Automatic carousel movement.
  useEffect(() => {
    if (filteredCertifications.length <= 1 || isInteracting) return;

    const interval = setInterval(() => {
      const nextPage =
        activePage >= pageCount - 1 ? 0 : activePage + 1;

      goToPage(nextPage);
    }, 5000);

    return () => clearInterval(interval);
  }, [
    activePage,
    pageCount,
    isInteracting,
    filteredCertifications.length,
    goToPage,
  ]);

  // Clean up timer.
  useEffect(() => {
    return () => {
      if (interactionTimeout.current) {
        clearTimeout(interactionTimeout.current);
      }
    };
  }, []);

  // Close certificate preview with Escape.
  useEffect(() => {
    if (!selectedCertificate) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedCertificate(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedCertificate]);

  return (
    <section id="certifications" className="certifications-section">
      <div className="certifications-container">

        {/* Header */}
        <header className="certifications-header">
          <span className="certifications-tag">
            <FiAward />
            CERTIFICATIONS
          </span>

          <h2>
            My <span>Certifications</span>
          </h2>

          <p>
            A collection of professional certifications that validate my
            skills in AI, data science, and software development.
          </p>
        </header>

        {/* Category filters */}
        <div
          className="certification-filters"
          aria-label="Filter certifications"
        >
          {categoryFilters.map(({ label, value, icon: Icon }) => {
            const count = certifications.filter((certification) =>
              matchesCategory(certification.category, value)
            ).length;

            if (value !== "All" && count === 0) return null;

            return (
              <button
                key={value}
                type="button"
                className={`cert-filter ${
                  activeCategory === value ? "active" : ""
                }`}
                onClick={() => {
                  pauseAutoScroll();
                  setActiveCategory(value);
                }}
                aria-pressed={activeCategory === value}
              >
                <Icon />
                <span>{label}</span>
                <span className="cert-filter-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Carousel toolbar */}
        <div className="certifications-toolbar">
          <div className="certifications-count">
            <FiAward />
            <span>
              {filteredCertifications.length} Certifications
            </span>
          </div>
        </div>

        {/* Carousel with nearby arrows */}
        <div className="cert-carousel-wrapper">

          <button
            type="button"
            className="cert-carousel-arrow cert-arrow-left"
            onClick={() => {
              pauseAutoScroll();
              goToPage(activePage - 1);
            }}
            disabled={activePage === 0}
            aria-label="Previous certifications"
          >
            <FiChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="certifications-grid"
            onScroll={handleScroll}
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
            onTouchStart={pauseAutoScroll}
            onWheel={pauseAutoScroll}
            aria-label="Certifications carousel"
          >
            {filteredCertifications.map((certification) => (
              <div className="cert-slide" key={certification.id}>
                <CertificationCard
                  certification={certification}
                  onPreview={setSelectedCertificate}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="cert-carousel-arrow cert-arrow-right"
            onClick={() => {
              pauseAutoScroll();
              goToPage(activePage + 1);
            }}
            disabled={activePage >= pageCount - 1}
            aria-label="Next certifications"
          >
            <FiChevronRight />
          </button>

        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="cert-pagination" aria-label="Carousel pagination">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                className={`cert-dot ${
                  activePage === index ? "active" : ""
                }`}
                onClick={() => {
                  pauseAutoScroll();
                  goToPage(index);
                }}
                aria-label={`Go to certification page ${index + 1}`}
                aria-current={activePage === index ? "true" : undefined}
              />
            ))}
          </div>
        )}

        {/* View all */}
        <div className="certifications-footer">
          <button
            type="button"
            className="cert-view-all"
            onClick={() => {
              pauseAutoScroll();
              setActiveCategory("All");

              scrollRef.current?.scrollTo({
                left: 0,
                behavior: "smooth",
              });

              setActivePage(0);
            }}
          >
            <FiAward />
            <span>View All Certificates</span>
            <FiChevronRight />
          </button>
        </div>

      </div>

      {/* Certificate preview modal */}
      {selectedCertificate && (
        <div
          className="cert-preview-modal"
          onClick={() => setSelectedCertificate(null)}
          role="presentation"
        >
          <div
            className="cert-preview-modal-content"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedCertificate.title} certificate preview`}
          >
            <button
              type="button"
              className="cert-modal-close"
              onClick={() => setSelectedCertificate(null)}
              aria-label="Close preview"
            >
              <FiX />
            </button>

            <img
              src={selectedCertificate.certificateImage}
              alt={`${selectedCertificate.title} certificate`}
            />

            <h3>{selectedCertificate.title}</h3>
            <p>{selectedCertificate.issuingOrganization}</p>
          </div>
        </div>
      )}

    </section>
  );
};

export default Certifications;