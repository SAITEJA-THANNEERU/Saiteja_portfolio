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

  const [menuOpen, setMenuOpen] =
    useState(false);

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
   * LENIS + GSAP / NATIVE TOUCH SCROLL
   * ==========================================================
   *
   * IMPORTANT:
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
     *
     * Do NOT create a Lenis instance on touch devices.
     *
     * This is the important part of the fix.
     *
     * The browser must be allowed to handle:
     *
     *   touchstart
     *   touchmove
     *   touchend
     *   native vertical scrolling
     *
     * without a smooth-scroll library intercepting the
     * scrolling pipeline.
     */

    if (isTouchDevice) {
      lenis = null;

      /*
       * Make the document itself the native scroll owner.
       *
       * These are inline values only for touch devices.
       * Desktop styling is completely untouched.
       */

      const html =
        document.documentElement;

      const body =
        document.body;

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

      /*
       * Allow normal vertical finger scrolling.
       *
       * This does NOT disable the 3D model.
       * It only tells the browser that vertical
       * touch movement belongs to page scrolling.
       */

      html.style.touchAction =
        "pan-y";

      body.style.touchAction =
        "pan-y";

      /*
       * Keep ScrollTrigger synchronized with
       * native browser scrolling.
       */

      window.addEventListener(
        "scroll",
        ScrollTrigger.update,
        {
          passive: true,
        }
      );

      /*
       * Make sure ScrollTrigger has the correct
       * measurements after the page is ready.
       */

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      /*
       * ======================================================
       * MOBILE / TABLET CLEANUP
       * ======================================================
       */

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
     *
     * ONLY desktop gets Lenis.
     *
     * Your premium scrolling configuration is preserved.
     */

    const instance = new Lenis({
      duration: 1.6,

      easing: (t) =>
        1 - Math.pow(1 - t, 5),

      orientation: "vertical",

      gestureOrientation:
        "vertical",

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

    const updateLenis = (
      time: number
    ) => {
      instance.raf(
        time * 1000
      );
    };

    gsap.ticker.add(
      updateLenis
    );

    /*
     * Keep the lag-smoothing setting you
     * changed earlier.
     */

    gsap.ticker.lagSmoothing(
      500,
      33
    );

    /*
     * ========================================================
     * DESKTOP NAVIGATION
     * ========================================================
     */

    const links =
      Array.from(
        document.querySelectorAll<HTMLAnchorElement>(
          ".desktop-navigation a"
        )
      );

    const linkHandlers =
      new Map<
        HTMLAnchorElement,
        (event: MouseEvent) => void
      >();

    links.forEach(
      (element) => {
        const handler = (
          event: MouseEvent
        ) => {
          /*
           * Desktop navigation only.
           *
           * Touch devices never reach this
           * because they use native anchors.
           */

          if (
            window.matchMedia(
              "(pointer: coarse)"
            ).matches
          ) {
            return;
          }

          event.preventDefault();

          const section =
            element.getAttribute(
              "data-href"
            );

          if (!section) {
            return;
          }

          const target =
            document.querySelector(
              section
            );

          if (!target) {
            return;
          }

          /*
           * Keep your existing smooth desktop
           * section navigation.
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
      }
    );

    /*
     * ========================================================
     * DESKTOP RESIZE
     * ========================================================
     */

    const handleResize =
      () => {
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

      linkHandlers.forEach(
        (
          handler,
          element
        ) => {
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

      gsap.ticker.remove(
        updateLenis
      );

      instance.destroy();

      if (
        lenis === instance
      ) {
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

  const openProfileViewer =
    () => {
      setMenuOpen(false);

      setProfileViewerOpen(
        true
      );
    };

  const closeProfileViewer =
    () => {
      setProfileViewerOpen(
        false
      );
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
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    /*
     * Desktop:
     * Stop Lenis while the profile
     * viewer is open.
     *
     * Mobile/tablet:
     * lenis is null, so nothing happens.
     */

    if (lenis) {
      lenis.stop();
    }

    const handleEscape =
      (
        event: KeyboardEvent
      ) => {
        if (
          event.key ===
          "Escape"
        ) {
          setProfileViewerOpen(
            false
          );
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
       * Only restart Lenis on desktop.
       *
       * Mobile/tablet uses native scrolling.
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
  }, [
    profileViewerOpen,
  ]);

  /*
   * ==========================================================
   * MOBILE MENU SCROLL LOCK
   * ==========================================================
   */

  useEffect(() => {
    if (
      menuOpen &&
      window.innerWidth <=
        768 &&
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

  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

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
            alt={
              config.developer.fullName
            }
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
                <HoverLinks
                  text="HOME"
                />
              </a>
            </li>

            <li>
              <a
                data-href="#about"
                href="#about"
              >
                <HoverLinks
                  text="ABOUT"
                />
              </a>
            </li>

            <li>
              <a
                data-href=".what-section"
                href="#what-build"
              >
                <HoverLinks
                  text="BUILD"
                />
              </a>
            </li>

            <li>
              <a
                data-href="#career"
                href="#career"
              >
                <HoverLinks
                  text="CAREER"
                />
              </a>
            </li>

            <li>
              <a
                data-href="#education"
                href="#education"
              >
                <HoverLinks
                  text="EDUCATION"
                />
              </a>
            </li>

            <li>
              <a
                data-href="#techstack"
                href="#techstack"
              >
                <HoverLinks
                  text="TECH"
                />
              </a>
            </li>

            <li>
              <a
                data-href="#work"
                href="#work"
              >
                <HoverLinks
                  text="WORK"
                />
              </a>
            </li>

            <li>
              <a
                data-href="#game-hire"
                href="#game-hire"
              >
                <HoverLinks
                  text="GAME"
                />
              </a>
            </li>

            <li>
              <a
                data-href="#contact"
                href="#contact"
              >
                <HoverLinks
                  text="CONTACT"
                />
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
              (previous) =>
                !previous
            )
          }
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={
            menuOpen
          }
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
          onClick={
            closeProfileViewer
          }
        >

          <div
            className="profile-image-viewer-content"
            onClick={(
              event
            ) => {
              event.stopPropagation();
            }}
          >

            <button
              type="button"
              className="profile-image-viewer-close"
              aria-label="Close profile image"
              onClick={
                closeProfileViewer
              }
            >
              ×
            </button>

            <img
              src={profileImage}
              alt={
                config.developer.fullName
              }
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
        aria-hidden={
          !menuOpen
        }
      >
        <nav aria-label="Mobile navigation">

          <ul>

            <li>
              <a
                href="#landingDiv"
                onClick={
                  closeMenu
                }
              >
                HOME
              </a>
            </li>

            <li>
              <a
                href="#about"
                onClick={
                  closeMenu
                }
              >
                ABOUT
              </a>
            </li>

            <li>
              <a
                href="#what-build"
                onClick={
                  closeMenu
                }
              >
                WHAT I BUILD
              </a>
            </li>

            <li>
              <a
                href="#career"
                onClick={
                  closeMenu
                }
              >
                CAREER
              </a>
            </li>

            <li>
              <a
                href="#education"
                onClick={
                  closeMenu
                }
              >
                EDUCATION
              </a>
            </li>

            <li>
              <a
                href="#techstack"
                onClick={
                  closeMenu
                }
              >
                TECH STACK
              </a>
            </li>

            <li>
              <a
                href="#work"
                onClick={
                  closeMenu
                }
              >
                PROJECTS &
                CERTIFICATIONS
              </a>
            </li>

            <li>
              <a
                href="#game-hire"
                onClick={
                  closeMenu
                }
              >
                GAME / HIRE
              </a>
            </li>

            <li>
              <a
                href="#contact"
                onClick={
                  closeMenu
                }
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