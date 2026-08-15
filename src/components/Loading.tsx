import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingContext";
import { config } from "../config";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();

  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  /*
   * ---------------------------------------------------------
   * LOADING COMPLETION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (percent < 100) return;

    const loadedTimer = window.setTimeout(() => {
      setLoaded(true);
    }, 600);

    return () => {
      window.clearTimeout(loadedTimer);
    };
  }, [percent]);

  useEffect(() => {
    if (!loaded) return;

    const readyTimer = window.setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => {
      window.clearTimeout(readyTimer);
    };
  }, [loaded]);

  /*
   * ---------------------------------------------------------
   * EXIT ANIMATION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!isLoaded) return;

    let cancelled = false;
    let exitTimer: number | undefined;

    import("./utils/initialFX").then((module) => {
      if (cancelled) return;

      /*
       * Fade the ENTIRE loading screen.
       */
      setClicked(true);

      exitTimer = window.setTimeout(() => {
        if (cancelled) return;

        module.initialFX?.();

        setIsLoading(false);
      }, 900);
    });

    return () => {
      cancelled = true;

      if (exitTimer !== undefined) {
        window.clearTimeout(exitTimer);
      }
    };
  }, [isLoaded, setIsLoading]);

  /*
   * ---------------------------------------------------------
   * MOUSE GLOW
   * ---------------------------------------------------------
   */

  function handleMouseMove(
    e: React.MouseEvent<HTMLElement>
  ) {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    target.style.setProperty(
      "--mouse-x",
      `${x}px`
    );

    target.style.setProperty(
      "--mouse-y",
      `${y}px`
    );
  }

  /*
   * ---------------------------------------------------------
   * SAFE PERCENTAGE
   * ---------------------------------------------------------
   */

  const safePercent = Math.min(
    Math.max(percent, 0),
    100
  );

  return (
    <div
      className={`loading-screen ${
        clicked ? "loading-clicked" : ""
      }`}
    >

      {/* =====================================================
          HEADER
          IMPORTANT:
          Header is INSIDE loading-screen so it disappears
          together with the loader.
      ===================================================== */}

      <div className="loading-header">

        <a
          href="/#"
          className="loader-title"
          data-cursor="disable"
        >
          {config.developer.fullName}
        </a>

        <div className="loader-status">
          <span className="loader-status-dot"></span>

          SYSTEM INITIALIZING
        </div>

      </div>


      {/* =====================================================
          MAIN LOADING WRAP
      ===================================================== */}

      <div
        className="loading-wrap"
        onMouseMove={handleMouseMove}
      >

        {/* Mouse glow */}

        <div className="loading-hover"></div>


        {/* Background particles */}

        <div className="loading-stars"></div>


        {/* =================================================
            UIVERSE SPEEDER
        ================================================= */}

        <div className="loading-speeder-area">

          {/* Clouds */}

          <div className="clouds">

            <div className="cloud cloud1"></div>
            <div className="cloud cloud2"></div>
            <div className="cloud cloud3"></div>
            <div className="cloud cloud4"></div>
            <div className="cloud cloud5"></div>

          </div>


          {/* Long speed lines */}

          <div className="longfazers">

            <span></span>
            <span></span>
            <span></span>
            <span></span>

          </div>


          {/* Speeder */}

          <div className="loader">

            <span>

              <span></span>
              <span></span>
              <span></span>
              <span></span>

            </span>

            <div className="base">

              <span></span>

              <div className="face"></div>

            </div>

          </div>

        </div>


        {/* =================================================
            LOADING CONTENT
        ================================================= */}

        <div
          className={`loading-button ${
            loaded ? "loading-complete" : ""
          }`}
        >

          <div className="loading-main-content">

            {/* TITLE */}

            <div className="loading-title">

              ENTERING{" "}

              <span>THE WORLD</span>{" "}

              OF SAITEJA

            </div>


            {/* PROGRESS */}

            <div className="progress-area">

              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{
                    width: `${safePercent}%`,
                  }}
                >

                  <div className="progress-shine"></div>

                </div>


                <div
                  className="progress-dot"
                  style={{
                    left: `${safePercent}%`,
                  }}
                ></div>

              </div>


              <span className="progress-percent">
                {safePercent}%
              </span>

            </div>


            {/* MESSAGE */}

            <div className="loading-message">
              Your experience is loading...
            </div>

          </div>

        </div>

      </div>


    </div>
  );
};

export default Loading;