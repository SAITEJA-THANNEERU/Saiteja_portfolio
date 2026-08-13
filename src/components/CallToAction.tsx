import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { config } from "../config";
import "./styles/CallToAction.css";

const CallToAction = () => {
  const [playAnimation, setPlayAnimation] = useState<object | null>(null);
  const [hireAnimation, setHireAnimation] = useState<object | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/animations/play-with-me.json").then((res) => res.json()),
      fetch("/animations/hire-me.json").then((res) => res.json()),
    ])
      .then(([playData, hireData]) => {
        setPlayAnimation(playData);
        setHireAnimation(hireData);
      })
      .catch((error) => {
        console.error("Failed to load CTA animations:", error);
      });
  }, []);

  return (
    <section className="cta-section">
      <div className="cta-buttons">

        {/* PLAY WITH ME */}
        <div className="cta-item cta-item-play">
          <div className="cta-animation cta-animation-play">
            {playAnimation && (
              <Lottie
                animationData={playAnimation}
                loop
                autoplay
              />
            )}
          </div>

          <Link
            to="/play"
            className="cta-btn cta-btn-play"
            data-cursor="disable"
          >
            <span className="cta-icon">🎮</span>
            <span className="cta-text">PLAY WITH ME</span>
            <span className="cta-arrow">→</span>
          </Link>
        </div>

        {/* HIRE ME */}
        <div className="cta-item cta-item-hire">
          <a
            href={config.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn cta-btn-hire"
            data-cursor="disable"
          >
            <span className="cta-icon">💼</span>
            <span className="cta-text">HIRE ME</span>
            <span className="cta-arrow">→</span>
          </a>

          <div className="cta-animation cta-animation-hire">
            {hireAnimation && (
              <Lottie
                animationData={hireAnimation}
                loop
                autoplay
              />
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CallToAction;