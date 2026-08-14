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
   * LENIS SMOOTH SCROLL
   * ==========================================================
   *
   * Existing scrolling behavior is preserved.
   */

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.7,
      easing: (t) =>
        Math.min(
          1,
          1.001 - Math.pow(2, -10 * t)
        ),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis = instance;

    /*
     * Desktop:
     * Loading animation controls scrolling.
     *
     * Mobile / Tablet:
     * Start scrolling immediately.
     */
    if (window.innerWidth <= 1024) {
      instance.start();
    } else {
      instance.stop();
    }

    let frameId = 0;

    const raf = (time: number) => {
      instance.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

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
         * Mobile navigation uses normal anchor navigation.
         */
        if (window.innerWidth <= 768) {
          return;
        }

        event.preventDefault();

        const section =
          element.getAttribute("data-href");

        if (!section) return;

        const target =
          document.querySelector(section);

        if (target) {
          instance.scrollTo(
            target as HTMLElement,
            {
              offset: 0,
              duration: 1.5,
            }
          );
        }
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
     */

    const handleResize = () => {
      instance.resize();

      /*
       * Make sure scrolling is enabled when entering
       * mobile/tablet size.
       */
      if (window.innerWidth <= 1024) {
        instance.start();
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    /*
     * ========================================================
     * CLEANUP
     * ========================================================
     */

    return () => {
      cancelAnimationFrame(frameId);

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
   * Prevent background scrolling while the mobile menu
   * is open.
   */
  useEffect(() => {
    if (menuOpen && window.innerWidth <= 768) {
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
  }, [menuOpen]);

  return (
    <>
      <header className="header">

        {/* ==================================================
            PROFILE
            IMPORTANT:
            Existing profile image + orbit animation preserved.
        ================================================== */}

        <a
          href="#landingDiv"
          className="navbar-title"
          data-cursor="disable"
          aria-label="Home"
          onClick={closeMenu}
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
            DESKTOP / TABLET NAVIGATION
        ================================================== */}

        <nav
          className="desktop-navigation"
          aria-label="Primary navigation"
        >
          <ul>

            {/* HOME */}
            <li>
              <a
                data-href="#landingDiv"
                href="#landingDiv"
              >
                <HoverLinks text="HOME" />
              </a>
            </li>

            {/* ABOUT */}
            <li>
              <a
                data-href="#about"
                href="#about"
              >
                <HoverLinks text="ABOUT" />
              </a>
            </li>

            {/* BUILD */}
            <li>
              <a
                data-href=".what-section"
                href="#what-build"
              >
                <HoverLinks text="BUILD" />
              </a>
            </li>

            {/* CAREER */}
            <li>
              <a
                data-href="#career"
                href="#career"
              >
                <HoverLinks text="CAREER" />
              </a>
            </li>

            {/* EDUCATION */}
            <li>
              <a
                data-href="#education"
                href="#education"
              >
                <HoverLinks text="EDUCATION" />
              </a>
            </li>

            {/* TECH */}
            <li>
              <a
                data-href="#techstack"
                href="#techstack"
              >
                <HoverLinks text="TECH" />
              </a>
            </li>

            {/* WORK */}
            <li>
              <a
                data-href="#work"
                href="#work"
              >
                <HoverLinks text="WORK" />
              </a>
            </li>

            {/* GAME */}
            <li>
              <a
                data-href="#game-hire"
                href="#game-hire"
              >
                <HoverLinks text="GAME" />
              </a>
            </li>

            {/* CONTACT */}
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

      {/* ======================================================
          MOBILE NAVIGATION OVERLAY
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
          EXISTING DECORATIVE ELEMENTS
      ====================================================== */}

      <div className="landing-circle1" />
      <div className="landing-circle2" />
      <div className="nav-fade" />
    </>
  );
};

export default Navbar;