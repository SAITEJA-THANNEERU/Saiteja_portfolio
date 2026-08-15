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

  /*
   * ==========================================================
   * PROFILE IMAGE VIEWER
   * ==========================================================
   */

  const [profileViewerOpen, setProfileViewerOpen] =
    useState(false);

  /*
   * ==========================================================
   * LENIS + GSAP SMOOTH SCROLL
   * ==========================================================
   */

  useEffect(() => {
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches;

const instance = new Lenis({
  duration: 1.6,

  easing: (t) =>
    1 - Math.pow(1 - t, 5),

  orientation: "vertical",

  gestureOrientation: "vertical",

  smoothWheel: !isTouchDevice,

  wheelMultiplier: 0.85,

  touchMultiplier: 1,

  infinite: false,
});

    lenis = instance;

    /*
     * ========================================================
     * TOUCH DEVICES
     * ========================================================
     *
     * Mobile and tablets use the browser's native touch
     * scrolling. This avoids fighting with the browser's
     * natural gesture system.
     */

    if (isTouchDevice) {
      instance.stop();
    } else {
      instance.start();
    }

    /*
     * ========================================================
     * LENIS → GSAP
     * ========================================================
     *
     * Keep ScrollTrigger synchronized with Lenis.
     */

    instance.on("scroll", ScrollTrigger.update);

    /*
     * ========================================================
     * GSAP TICKER → LENIS
     * ========================================================
     *
     * One animation loop only.
     * This prevents competing requestAnimationFrame loops.
     */

    const updateLenis = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);

    /*
     * Prevent GSAP from artificially slowing its ticker.
     * This makes the Lenis movement more consistent.
     */

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
        /*
         * Mobile navigation keeps normal browser behavior.
         */

        if (window.matchMedia("(pointer: coarse)").matches) {
          return;
        }

        event.preventDefault();

        const section =
          element.getAttribute("data-href");

        if (!section) return;

        const target =
          document.querySelector(section);

        if (!target) return;

        /*
         * Use Lenis for smooth section navigation.
         */

        instance.scrollTo(
          target as HTMLElement,
          {
            offset: 0,
            duration: 1.2,
            immediate: false,
          }
        );
      };

      linkHandlers.set(
        element,
        handler
      );

      element.addEventListener(
        "click",
        handler
      );
    });

    /*
     * ========================================================
     * RESIZE
     * ========================================================
     *
     * Recalculate Lenis and correctly switch between
     * desktop and touch-device behavior.
     */

    const handleResize = () => {
      instance.resize();

      const touchDevice =
        window.matchMedia("(pointer: coarse)").matches;

      if (touchDevice) {
        instance.stop();
      } else {
        instance.start();
      }

      ScrollTrigger.refresh();
    };

    window.addEventListener(
      "resize",
      handleResize,
      { passive: true }
    );

    /*
     * ========================================================
     * CLEANUP
     * ========================================================
     */

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      linkHandlers.forEach(
        (handler, element) => {
          element.removeEventListener(
            "click",
            handler
          );
        }
      );

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

    const handleEscape = (
      event: KeyboardEvent
    ) => {
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

      /*
       * Only restart Lenis on non-touch devices.
       */

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
  }, [
    menuOpen,
    profileViewerOpen,
  ]);

  return (
    <>
      <header className="header">

        {/* ==================================================
            PROFILE
        ================================================== */}

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


        {/* ==================================================
            NAME
        ================================================== */}

        <a
          href="#landingDiv"
          className="navbar-name"
          data-cursor="disable"
          onClick={closeMenu}
        >
          SAI TEJA
        </a>


        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav
          className="desktop-navigation"
          aria-label="Primary navigation"
        >
          <ul>

            <li>
              <a
                data-href="#landingDiv"
                href="#landingDiv"
              >
                <HoverLinks text="HOME" />
              </a>
            </li>

            <li>
              <a
                data-href="#about"
                href="#about"
              >
                <HoverLinks text="ABOUT" />
              </a>
            </li>

            <li>
              <a
                data-href=".what-section"
                href="#what-build"
              >
                <HoverLinks text="BUILD" />
              </a>
            </li>

            <li>
              <a
                data-href="#career"
                href="#career"
              >
                <HoverLinks text="CAREER" />
              </a>
            </li>

            <li>
              <a
                data-href="#education"
                href="#education"
              >
                <HoverLinks text="EDUCATION" />
              </a>
            </li>

            <li>
              <a
                data-href="#techstack"
                href="#techstack"
              >
                <HoverLinks text="TECH" />
              </a>
            </li>

            <li>
              <a
                data-href="#work"
                href="#work"
              >
                <HoverLinks text="WORK" />
              </a>
            </li>

            <li>
              <a
                data-href="#game-hire"
                href="#game-hire"
              >
                <HoverLinks text="GAME" />
              </a>
            </li>

            <li>
              <a
                data-href="#contact"
                href="#contact"
              >
                <HoverLinks text="CONTACT" />
              </a>
            </li>

          </ul>
        </nav>


        {/* ==================================================
            MOBILE MENU BUTTON
        ================================================== */}

        <button
          type="button"
          className={`navbar-menu-toggle ${
            menuOpen
              ? "navbar-menu-toggle-open"
              : ""
          }`}
          onClick={() =>
            setMenuOpen(
              (previous) => !previous
            )
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


      {/* ======================================================
          PROFILE IMAGE VIEWER
      ====================================================== */}

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


      {/* ======================================================
          MOBILE NAVIGATION
      ====================================================== */}

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
                onClick={closeMenu}
              >
                HOME
              </a>
            </li>

            <li>
              <a
                href="#about"
                onClick={closeMenu}
              >
                ABOUT
              </a>
            </li>

            <li>
              <a
                href="#what-build"
                onClick={closeMenu}
              >
                WHAT I BUILD
              </a>
            </li>

            <li>
              <a
                href="#career"
                onClick={closeMenu}
              >
                CAREER
              </a>
            </li>

            <li>
              <a
                href="#education"
                onClick={closeMenu}
              >
                EDUCATION
              </a>
            </li>

            <li>
              <a
                href="#techstack"
                onClick={closeMenu}
              >
                TECH STACK
              </a>
            </li>

            <li>
              <a
                href="#work"
                onClick={closeMenu}
              >
                PROJECTS & CERTIFICATIONS
              </a>
            </li>

            <li>
              <a
                href="#game-hire"
                onClick={closeMenu}
              >
                GAME / HIRE
              </a>
            </li>

            <li>
              <a
                href="#contact"
                onClick={closeMenu}
              >
                CONTACT
              </a>
            </li>

          </ul>

        </nav>
      </div>


      {/* ======================================================
          DECORATIVE ELEMENTS
      ====================================================== */}

      <div className="landing-circle1" />

      <div className="landing-circle2" />

      <div className="nav-fade" />

    </>
  );
};

export default Navbar;