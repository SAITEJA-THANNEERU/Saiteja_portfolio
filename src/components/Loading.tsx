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
    <>
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="loading-header">

        <a
          href="/#"
          className="loader-title"
          data-cursor="disable"
        >
          {config.developer.fullName}
        </a>

        <div
          className={`loader-status ${
            clicked ? "loader-out" : ""
          }`}
        >
          <span className="loader-status-dot"></span>

          SYSTEM INITIALIZING
        </div>

      </div>

      {/* =====================================================
          LOADING SCREEN
      ===================================================== */}

      <div className="loading-screen">

        {/* Background particles */}
        <div className="loading-stars"></div>


        {/* =================================================
            MAIN LOADING WRAP
        ================================================= */}

        <div
          className={`loading-wrap ${
            clicked ? "loading-clicked" : ""
          }`}
          onMouseMove={handleMouseMove}
        >

          {/* Mouse glow */}
          <div className="loading-hover"></div>

          {/* =================================================
              ENERGY ORB
          ================================================= */}

          <div className="loading-orb-area">

            <div className="orb-energy energy-left"></div>

            <div className="orb-energy energy-right"></div>

            <div className="energy-orb">

              <div className="orb-glow"></div>

              <div className="orb-ring orb-ring-1"></div>

              <div className="orb-ring orb-ring-2"></div>

              <div className="orb-ring orb-ring-3"></div>

              <div className="orb-core">
                <div className="orb-core-inner"></div>
              </div>

            </div>

          </div>

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div
            className={`loading-button ${
              loaded ? "loading-complete" : ""
            }`}
          >

            <div className="loading-main-content">

              {/* =================================================
                  TITLE
              ================================================= */}

              <div className="loading-title">
  ENTERING <span>THE WORLD</span> OF SAITEJA
</div>

              {/* =================================================
                  PROGRESS BAR
              ================================================= */}

              <div className="progress-area">

                <div className="progress-track">

                  {/* Filled progress */}
                  <div
                    className="progress-fill"
                    style={{
                      width: `${safePercent}%`,
                    }}
                  >

                    <div className="progress-shine"></div>

                  </div>

                  {/* Glowing progress endpoint */}
                  <div
                    className="progress-dot"
                    style={{
                      left: `${safePercent}%`,
                    }}
                  ></div>

                </div>

                {/* Percentage */}
                <span className="progress-percent">
                  {safePercent}%
                </span>

              </div>

              {/* =================================================
                  STATUS MESSAGE
              ================================================= */}

              <div className="loading-message">
  Your experience is loading...
</div>

            </div>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="loading-footer">
  <span>
    {config.developer.fullName}
  </span>
</div>

      </div>
    </>
  );
};

export default Loading;