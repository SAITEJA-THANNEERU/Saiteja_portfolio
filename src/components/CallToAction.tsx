import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { config } from "../config";
import "./styles/CallToAction.css";

const CallToAction = () => {
  const [playAnimation, setPlayAnimation] =
    useState<object | null>(null);

  const [chatAnimation, setChatAnimation] =
    useState<object | null>(null);

  const [hireAnimation, setHireAnimation] =
    useState<object | null>(null);

  useEffect(() => {
    const loadAnimation = async (
      path: string,
      name: string
    ) => {
      try {
        const response = await fetch(path);

        if (!response.ok) {
          throw new Error(
            `${name} animation not found: ${path}`
          );
        }

        const data = await response.json();

        if (!data || typeof data !== "object") {
          throw new Error(
            `${name} animation contains invalid JSON`
          );
        }

        return data;
      } catch (error) {
        console.error(
          `[CTA] Failed to load ${name} animation:`,
          error
        );

        return null;
      }
    };

    const loadAnimations = async () => {
      const [
        playData,
        chatData,
        hireData,
      ] = await Promise.all([
        loadAnimation(
          "/animations/play-with-me.json",
          "Play"
        ),

        loadAnimation(
          "/animations/chat-ai-mini.json",
          "Chat"
        ),

        loadAnimation(
          "/animations/hire-me.json",
          "Hire"
        ),
      ]);

      setPlayAnimation(playData);
      setChatAnimation(chatData);
      setHireAnimation(hireData);
    };

    loadAnimations();
  }, []);

  /*
   * ============================================================
   * TALK WITH SAI NAVIGATION
   * ============================================================
   */

  const handleChatClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();

    const chatSection =
      document.getElementById("chat-with-sai");

    if (!chatSection) {
      console.warn(
        "Chat section #chat-with-sai was not found."
      );

      return;
    }

    chatSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    /*
     * Update URL hash without reloading
     */
    window.history.replaceState(
      null,
      "",
      "#chat-with-sai"
    );
  };

  return (
    <section
      className="cta-section"
      id="game-hire"
    >
      <div className="cta-buttons">

        {/* =====================================================
            PLAY WITH ME
        ===================================================== */}

        <div className="cta-item cta-item-play">

          {/* PLAY ANIMATION */}

          <div className="cta-animation cta-animation-play">
            {playAnimation && (
              <Lottie
                animationData={playAnimation}
                loop
                autoplay
                rendererSettings={{
                  preserveAspectRatio:
                    "xMidYMid meet",
                }}
              />
            )}
          </div>

          {/* PLAY BUTTON */}

          <Link
            to="/play"
            className="cta-btn cta-btn-play"
            data-cursor="disable"
          >
            <span className="cta-icon">
              🎮
            </span>

            <span className="cta-text">
              PLAY WITH ME
            </span>

            <span className="cta-arrow">
              →
            </span>
          </Link>

        </div>


        {/* =====================================================
            TALK WITH SAI
        ===================================================== */}

        <div className="cta-item cta-item-chat">

          {/* CHAT AI ANIMATION
              This stays ABOVE the button
              on every device.
          */}

          <div className="cta-animation cta-animation-chat">
            {chatAnimation && (
              <Lottie
                animationData={chatAnimation}
                loop
                autoplay
                rendererSettings={{
                  preserveAspectRatio:
                    "xMidYMid meet",
                }}
              />
            )}
          </div>

          {/* CHAT BUTTON */}

          <a
            href="#chat-with-sai"
            className="cta-btn cta-btn-chat"
            onClick={handleChatClick}
            data-cursor="disable"
            aria-label="Talk with Sai"
          >
            <span className="cta-icon">
              🤖
            </span>

            <span className="cta-text">
              TALK WITH MY ASSISTANT
            </span>

            <span className="cta-arrow cta-arrow-down">
              ↓
            </span>
          </a>

        </div>


        {/* =====================================================
            HIRE ME
        ===================================================== */}

        <div className="cta-item cta-item-hire">

          {/* HIRE BUTTON */}

          <a
            href={config.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn cta-btn-hire"
            data-cursor="disable"
          >
            <span className="cta-icon">
              💼
            </span>

            <span className="cta-text">
              HIRE ME
            </span>

            <span className="cta-arrow">
              →
            </span>
          </a>

          {/* HIRE ANIMATION */}

          <div className="cta-animation cta-animation-hire">
            {hireAnimation && (
              <Lottie
                animationData={hireAnimation}
                loop
                autoplay
                rendererSettings={{
                  preserveAspectRatio:
                    "xMidYMid meet",
                }}
              />
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default CallToAction;