import { useEffect } from "react";
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

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis = instance;
    instance.stop();

    let frameId = 0;

    const raf = (time: number) => {
      instance.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".header ul a")
    );

    const linkHandlers = new Map<
      HTMLAnchorElement,
      (event: MouseEvent) => void
    >();

    links.forEach((element) => {
      const handler = (event: MouseEvent) => {
        if (window.innerWidth <= 1024) return;

        event.preventDefault();

        const section = element.getAttribute("data-href");

        if (!section) return;

        const target = document.querySelector(section);

        if (target) {
          instance.scrollTo(target as HTMLElement, {
            offset: 0,
            duration: 1.5,
          });
        }
      };

      linkHandlers.set(element, handler);
      element.addEventListener("click", handler);
    });

    const handleResize = () => instance.resize();

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);

      window.removeEventListener("resize", handleResize);

      linkHandlers.forEach((handler, element) => {
        element.removeEventListener("click", handler);
      });

      instance.destroy();

      if (lenis === instance) {
        lenis = null;
      }
    };
  }, []);

  return (
    <>
      <div className="header">

        {/* PROFILE IMAGE / HOME */}
        <a
          href="/#landingDiv"
          className="navbar-title"
          data-cursor="disable"
          aria-label="Home"
        >
          <img
            src={profileImage}
            alt={config.developer.fullName}
            className="navbar-profile-image"
          />
        </a>

        {/* EMAIL */}
        <a
          href={`mailto:${config.contact.email}`}
          className="navbar-connect"
          data-cursor="disable"
        >
          {config.contact.email}
        </a>

        {/* NAVIGATION */}
        <ul>

          {/* HOME */}
          <li>
            <a
              data-href="#landingDiv"
              href="#landingDiv"
              aria-label="Home"
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

          {/* EXPERTISE / WHAT I BUILD */}
          <li>
            <a
              data-href=".what-section"
              href="#what-build"
            >
              <HoverLinks text="EXPERTISE" />
            </a>
          </li>

          {/* PROJECTS */}
          <li>
            <a
              data-href="#work"
              href="#work"
            >
              <HoverLinks text="PROJECTS" />
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
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;