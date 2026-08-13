import { useEffect, useRef } from "react";
import CertificationCard from "./CertificationCard";
import { certifications } from "../data/certifications";
import "./styles/Certifications.css";

const Certifications = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container || certifications.length <= 1) {
      return;
    }

    let animationFrame: number;
    let isInteracting = false;
    let interactionTimeout: ReturnType<typeof setTimeout>;

    const scrollSpeed = 0.35;

    const autoScroll = () => {
      if (!container) {
        return;
      }

      if (!isInteracting) {
        container.scrollLeft += scrollSpeed;

        /*
         * When the end is reached, smoothly continue from
         * the beginning to create a continuous carousel effect.
         */
        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 2
        ) {
          container.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        }
      }

      animationFrame = requestAnimationFrame(autoScroll);
    };

    const pauseAutoScroll = () => {
      isInteracting = true;

      clearTimeout(interactionTimeout);

      interactionTimeout = setTimeout(() => {
        isInteracting = false;
      }, 2000);
    };

    const handleMouseEnter = () => {
      isInteracting = true;
    };

    const handleMouseLeave = () => {
      isInteracting = false;
    };

    const handleWheel = () => {
      pauseAutoScroll();
    };

    const handleTouchStart = () => {
      pauseAutoScroll();
    };

    const handleTouchEnd = () => {
      clearTimeout(interactionTimeout);

      interactionTimeout = setTimeout(() => {
        isInteracting = false;
      }, 2000);
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });

    animationFrame = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrame);

      clearTimeout(interactionTimeout);

      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <section id="certifications" className="certifications-section">
      <div className="certifications-container">

        <div className="certifications-header">
  <span>✦ CERTIFICATIONS</span>

  <h2>
    Professional <span>Certifications</span>
  </h2>

  <p>
    A selection of certifications and learning achievements.
  </p>
</div>

        <div
          ref={scrollRef}
          className="certifications-grid"
          aria-label="Certifications carousel"
        >
          {certifications.map((certification) => (
            <CertificationCard
              key={certification.id}
              certification={certification}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certifications;