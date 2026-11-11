import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";
import { config } from "../config";

gsap.registerPlugin(ScrollTrigger);

export let lenis: Lenis | null = null;

const Navbar = () => {
  const profileImage = "/images/mypicnbg.png";

  const [menuOpen, setMenuOpen] = useState(false);

  const [activeSection, setActiveSection] =
    useState("#landingDiv");

  /*
   * ==========================================================
   * PROFILE IMAGE VIEWER
   * ==========================================================
   */

  const [
    profileViewerOpen,
    setProfileViewerOpen,
  ] = useState(false);

  /*
   * ==========================================================
   * ACTIVE NAVIGATION / SCROLL SPY
   * ==========================================================
   */

  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        ".desktop-navigation a[data-href]"
      )
    );

    const sections = links
      .map((link) => {
        const selector = link.getAttribute("data-href");

        if (!selector) return null;

        const element = document.querySelector(selector);

        if (!element) return null;

        return {
          selector,
          element,
        };
      })
      .filter(
        (
          item
        ): item is {
          selector: string;
          element: Element;
        } => item !== null
      );

    let animationFrame = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        const activationPoint = window.innerHeight * 0.35;

        let currentSection = "#landingDiv";

        sections.forEach(({ selector, element }) => {
          const rect = element.getBoundingClientRect();

          if (rect.top <= activationPoint) {
            currentSection = selector;
          }
        });

        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 5
        ) {
          currentSection =
            sections[sections.length - 1]?.selector ||
            currentSection;
        }

        setActiveSection(currentSection);
      });
    };

    window.addEventListener(
      "scroll",
      updateActiveSection,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateActiveSection
    );

    updateActiveSection();

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        "scroll",
        updateActiveSection
      );

      window.removeEventListener(
        "resize",
        updateActiveSection
      );
    };
  }, []);

  /*
   * ==========================================================
   * LENIS + GSAP / NATIVE TOUCH SCROLL
   * ==========================================================
   *
   * Desktop / laptop:
   *   Lenis + GSAP controls smooth scrolling.
   *
   * Mobile / tablet:
   *   Lenis is NOT initialized.
   *   The browser owns native touch scrolling.
   *
   * This prevents Lenis from interfering with the
   * browser's touch gesture system.
   */

  useEffect(() => {
    const isTouchDevice =
      window.matchMedia(
        "(pointer: coarse)"
      ).matches;

    /*
     * ========================================================
     * MOBILE / TABLET
     * ========================================================
     */

    if (isTouchDevice) {
      lenis = null;

      const html = document.documentElement;
      const body = document.body;

      const previousHtmlOverflowY =
        html.style.overflowY;

      const previousBodyOverflowY =
        body.style.overflowY;

      const previousHtmlTouchAction =
        html.style.touchAction;

      const previousBodyTouchAction =
        body.style.touchAction;

      html.style.overflowY = "auto";
      body.style.overflowY = "auto";

      html.style.touchAction = "pan-y";
      body.style.touchAction = "pan-y";

      window.addEventListener(
        "scroll",
        ScrollTrigger.update,
        {
          passive: true,
        }
      );

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        window.removeEventListener(
          "scroll",
          ScrollTrigger.update
        );

        html.style.overflowY =
          previousHtmlOverflowY;

        body.style.overflowY =
          previousBodyOverflowY;

        html.style.touchAction =
          previousHtmlTouchAction;

        body.style.touchAction =
          previousBodyTouchAction;

        if (lenis === null) {
          lenis = null;
        }
      };
    }

    /*
     * ========================================================
     * DESKTOP / LAPTOP
     * ========================================================
     */

    const instance = new Lenis({
      duration: 1.6,

      easing: (t) =>
        1 - Math.pow(1 - t, 5),

      orientation: "vertical",

      gestureOrientation: "vertical",

      smoothWheel: true,

      wheelMultiplier: 0.85,

      touchMultiplier: 1,

      infinite: false,
    });

    lenis = instance;

    instance.start();

    /*
     * ========================================================
     * LENIS → GSAP
     * ========================================================
     */

    instance.on(
      "scroll",
      ScrollTrigger.update
    );

    const updateLenis = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);

    gsap.ticker.lagSmoothing(500, 33);

    /*
     * ========================================================
     * DESKTOP NAVIGATION
     * ========================================================
     */

    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        ".desktop-navigation a"
      )
    );

    const linkHandlers = new Map<
      HTMLAnchorElement,
      (event: MouseEvent) => void
    >();

    links.forEach((element) => {
      const handler = (event: MouseEvent) => {
        if (
          window.matchMedia(
            "(pointer: coarse)"
          ).matches
        ) {
          return;
        }

        event.preventDefault();

        const section = element.getAttribute("data-href");

        if (!section) {
          return;
        }

        const target = document.querySelector(section);

        if (!target) {
          return;
        }

        instance.scrollTo(
          target as HTMLElement,
          {
            offset: 0,
            duration: 1.2,
            immediate: false,
          }
        );
      };

      linkHandlers.set(element, handler);

      element.addEventListener("click", handler);
    });

    /*
     * ========================================================
     * DESKTOP RESIZE
     * ========================================================
     */

    const handleResize = () => {
      instance.resize();

      ScrollTrigger.refresh();
    };

    window.addEventListener(
      "resize",
      handleResize,
      {
        passive: true,
      }
    );

    /*
     * ========================================================
     * DESKTOP CLEANUP
     * ========================================================
     */

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      linkHandlers.forEach((handler, element) => {
        element.removeEventListener(
          "click",
          handler
        );
      });

      instance.off(
        "scroll",
        ScrollTrigger.update
      );

      gsap.ticker.remove(updateLenis);

      instance.destroy();

      if (lenis === instance) {
        lenis = null;
      }
    };
  }, []);

  /*
   * ==========================================================
   * MOBILE MENU
   * ==========================================================
   */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /*
   * ==========================================================
   * PROFILE VIEWER
   * ==========================================================
   */

  const openProfileViewer = () => {
    setMenuOpen(false);

    setProfileViewerOpen(true);
  };

  const closeProfileViewer = () => {
    setProfileViewerOpen(false);
  };

  /*
   * ==========================================================
   * PROFILE VIEWER SCROLL LOCK
   * ==========================================================
   */

  useEffect(() => {
    if (!profileViewerOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    if (lenis) {
      lenis.stop();
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileViewerOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      if (
        lenis &&
        !window.matchMedia(
          "(pointer: coarse)"
        ).matches
      ) {
        lenis.start();
      }

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [profileViewerOpen]);

  /*
   * ==========================================================
   * MOBILE MENU SCROLL LOCK
   * ==========================================================
   */

  useEffect(() => {
    if (
      menuOpen &&
      window.innerWidth <= 768 &&
      !profileViewerOpen
    ) {
      document.body.classList.add(
        "navbar-menu-open"
      );
    } else {
      document.body.classList.remove(
        "navbar-menu-open"
      );
    }

    return () => {
      document.body.classList.remove(
        "navbar-menu-open"
      );
    };
  }, [menuOpen, profileViewerOpen]);

  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <>
      <header className="header">

        {/* PROFILE */}

        <a
          href="#landingDiv"
          className="navbar-title"
          data-cursor="disable"
          aria-label="View profile image"
          onClick={(event) => {
            event.preventDefault();

            openProfileViewer();
          }}
        >
          <img
            src={profileImage}
            alt={config.developer.fullName}
            className="navbar-profile-image"
          />
        </a>

        {/* NAME */}

        <a
          href="#landingDiv"
          className="navbar-name"
          data-cursor="disable"
          onClick={closeMenu}
        >
          SAI TEJA
        </a>

        {/* DESKTOP NAVIGATION */}

        <nav
          className="desktop-navigation"
          aria-label="Primary navigation"
        >
          <ul>

            <li>
              <a
                data-href="#landingDiv"
                href="#landingDiv"
                className={
                  activeSection === "#landingDiv"
                    ? "active"
                    : ""
                }
              >
                <HoverLinks text="HOME" />
              </a>
            </li>

            <li>
              <a
                data-href="#about"
                href="#about"
                className={
                  activeSection === "#about"
                    ? "active"
                    : ""
                }
              >
                <HoverLinks text="ABOUT" />
              </a>
            </li>

            <li>
              <a
                data-href=".what-section"
                href="#what-build"
                className={
                  activeSection === ".what-section"
                    ? "active"
                    : ""
                }
              >
                <HoverLinks text="BUILD" />
              </a>
            </li>

            <li>
              <a
                data-href="#career"
                href="#career"
                className={
                  activeSection === "#career"
                    ? "active"
                    : ""
                }
              >
                <HoverLinks text="CAREER" />
              </a>
            </li>

            <li>
              <a
                data-href="#education"
                href="#education"
                className={
                  activeSection === "#education"
                    ? "active"
                    : ""
                }
              >
                <HoverLinks text="EDUCATION" />
              </a>
            </li>

            <li>
              <a
                data-href="#techstack"
                href="#techstack"
                className={
                  activeSection === "#techstack"
                    ? "active"
                    : ""
                }
              >
                <HoverLinks text="TECH" />
              </a>
            </li>

            <li>
              <a
                data-href="#work"
                href="#work"
                className={
                  activeSection === "#work"
                    ? "active"
                    : ""
                }
              >
                <HoverLinks text="WORK" />
              </a>
            </li>

            <li>
              <a
                data-href="#game-hire"
                href="#game-hire"
                className={
                  activeSection === "#game-hire"
                    ? "active"
                    : ""
                }
              >
                <HoverLinks text="GAME" />
              </a>
            </li>

            <li>
              <a
                data-href="#contact"
                href="#contact"
                className={
                  activeSection === "#contact"
                    ? "active"
                    : ""
                }
              >
                <HoverLinks text="CONTACT" />
              </a>
            </li>

          </ul>
        </nav>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          className={`navbar-menu-toggle ${
            menuOpen
              ? "navbar-menu-toggle-open"
              : ""
          }`}
          onClick={() =>
            setMenuOpen((previous) => !previous)
          }
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

      </header>

      {/* PROFILE IMAGE VIEWER */}

      {profileViewerOpen && (
        <div
          className="profile-image-viewer"
          role="dialog"
          aria-modal="true"
          aria-label="Profile image viewer"
          onClick={closeProfileViewer}
        >
          <div
            className="profile-image-viewer-content"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <button
              type="button"
              className="profile-image-viewer-close"
              aria-label="Close profile image"
              onClick={closeProfileViewer}
            >
              ×
            </button>

            <img
              src={profileImage}
              alt={config.developer.fullName}
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* MOBILE NAVIGATION */}

      <div
        className={`mobile-navigation ${
          menuOpen
            ? "mobile-navigation-open"
            : ""
        }`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          <ul>

            <li>
              <a
                href="#landingDiv"
                className={
                  activeSection === "#landingDiv"
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                HOME
              </a>
            </li>

            <li>
              <a
                href="#about"
                className={
                  activeSection === "#about"
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                ABOUT
              </a>
            </li>

            <li>
              <a
                href="#what-build"
                className={
                  activeSection === ".what-section"
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                WHAT I BUILD
              </a>
            </li>

            <li>
              <a
                href="#career"
                className={
                  activeSection === "#career"
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                CAREER
              </a>
            </li>

            <li>
              <a
                href="#education"
                className={
                  activeSection === "#education"
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                EDUCATION
              </a>
            </li>

            <li>
              <a
                href="#techstack"
                className={
                  activeSection === "#techstack"
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                TECH STACK
              </a>
            </li>

            <li>
              <a
                href="#work"
                className={
                  activeSection === "#work"
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                PROJECTS & CERTIFICATIONS
              </a>
            </li>

            <li>
              <a
                href="#game-hire"
                className={
                  activeSection === "#game-hire"
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                GAME / HIRE
              </a>
            </li>

            <li>
              <a
                href="#contact"
                className={
                  activeSection === "#contact"
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                CONTACT
              </a>
            </li>

          </ul>
        </nav>
      </div>

      {/* DECORATIVE ELEMENTS */}

      <div className="landing-circle1" />

      <div className="landing-circle2" />

      <div className="nav-fade" />

    </>
  );
};

export default Navbar;