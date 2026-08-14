import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { config } from "../config";
import "./styles/ChatWithSai.css";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are ${config.developer.fullName}, a ${config.developer.title} from ${config.social.location}. You are NOT an AI assistant - you ARE ${config.developer.name} himself chatting with visitors on your portfolio website.

About you (${config.developer.fullName}):
- Full name: ${config.developer.fullName}
- Location: ${config.social.location}
- Profession: ${config.developer.title}
- Experience: See the portfolio for details
- Specialties: Software Development, AI, Backend, Full-Stack Development
- Notable projects: Scorera, Game Portal Platform, Ultimate Choice Game
- Languages: English (fluent)
- Hobbies: Programming, AI, Building projects
- Contact: Available through the portfolio website

Rules:
1. Always respond in first person ("I", "my", "me")
2. Be friendly, helpful, and concise
3. If asked about work/projects, provide accurate summaries from the portfolio
4. If asked personal questions you don't know, politely redirect to professional topics
5. Keep responses concise but helpful
6. Discuss programming, AI, and related topics when relevant
7. Never say you are an AI or language model - respond as ${config.developer.name}
8. Use occasional emoji to be friendly 😊`;

const ChatWithSai = () => {
  /* ============================================================
     CHAT MESSAGES
  ============================================================ */

  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>([
      {
        role: "assistant",
        content:
          `Hello! I'm ${config.developer.name} 🤖 Ask me anything about my work, projects, AI, programming, or just say hi!`,
      },
    ]);

  /* ============================================================
     CHAT INPUT
  ============================================================ */

  const [chatInput, setChatInput] =
    useState("");

  /* ============================================================
     TYPING STATE
  ============================================================ */

  const [isTyping, setIsTyping] =
    useState(false);

  /* ============================================================
     CHAT SCROLL REF
  ============================================================ */

  const messagesRef =
    useRef<HTMLDivElement | null>(null);

  /* ============================================================
     AUTO SCROLL
  ============================================================
     
     Whenever:
     - a new user message is added
     - an AI response arrives
     - AI starts typing
     
     the chat automatically moves to the
     newest message.

     The user can still manually scroll
     upward using the scrollbar.
  ============================================================ */

  useEffect(() => {
    const container =
      messagesRef.current;

    if (!container) {
      return;
    }

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [
    chatMessages,
    isTyping,
  ]);

  /* ============================================================
     SEND MESSAGE
  ============================================================ */

  const sendMessage = async () => {
    const trimmedInput =
      chatInput.trim();

    if (
      !trimmedInput ||
      isTyping
    ) {
      return;
    }

    /* ----------------------------------------------------------
       USER MESSAGE
    ---------------------------------------------------------- */

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmedInput,
    };

    const conversationMessages = [
      ...chatMessages,
      userMessage,
    ];

    setChatMessages(
      conversationMessages
    );

    setChatInput("");
    setIsTyping(true);

    /* ----------------------------------------------------------
       API REQUEST
    ---------------------------------------------------------- */

    try {
      const messages = [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },

        ...conversationMessages.map(
          (message) => ({
            role: message.role,
            content: message.content,
          })
        ),
      ];

      const response =
        await fetch("/api/chat", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            messages,
          }),
        });

      /* --------------------------------------------------------
         RESPONSE VALIDATION
      -------------------------------------------------------- */

      if (!response.ok) {
        throw new Error(
          `Chat request failed: ${response.status}`
        );
      }

      const data =
        await response.json();

      const content =
        data?.choices?.[0]
          ?.message?.content;

      if (
        typeof content !==
        "string"
      ) {
        throw new Error(
          "Invalid chat response"
        );
      }

      /* --------------------------------------------------------
         AI MESSAGE
      -------------------------------------------------------- */

      setChatMessages(
        (previous) => [
          ...previous,
          {
            role: "assistant",
            content,
          },
        ]
      );
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      /* --------------------------------------------------------
         ERROR MESSAGE
      -------------------------------------------------------- */

      setChatMessages(
        (previous) => [
          ...previous,
          {
            role: "assistant",
            content:
              "Sorry, I'm having some connection issues. Try again? 😅",
          },
        ]
      );
    } finally {
      setIsTyping(false);
    }
  };

  /* ============================================================
     ENTER KEY
  ============================================================ */

  const handleKeyPress = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };

  /* ============================================================
     UI
  ============================================================ */

  return (
    <section
      className="chat-with-sai-section"
      id="chat-with-sai"
    >
      <div className="chat-with-sai-container">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="chat-with-sai-heading">

          <span className="chat-with-sai-eyebrow">
            <span>✦</span>
            TALK WITH SAI TEJA
          </span>

          <h2>
            Chat with
            <span> my AI</span>
          </h2>

          <p>
            Ask me about my projects,
            skills, experience, AI,
            software development,
            or anything else you'd
            like to know.
          </p>

        </div>

        {/* ======================================================
            CHAT CARD
        ====================================================== */}

        <div className="chat-with-sai-card">

          {/* ====================================================
              CHAT HEADER
          ==================================================== */}

          <div className="chat-with-sai-header">

            <div className="chat-with-sai-title">

              <div className="chat-with-sai-avatar">
                ST
              </div>

              <div>

                <strong>
                  Sai Teja's AI
                </strong>

                <span>
                  ● Online
                </span>

              </div>

            </div>

            <div className="chat-with-sai-status">
              AI
            </div>

          </div>

          {/* ====================================================
              MESSAGES
          ==================================================== */}

          <div
            ref={messagesRef}
            className="chat-with-sai-messages"
          >

            {chatMessages.map(
              (message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`chat-with-sai-message ${message.role}`}
                >

                  <div className="chat-with-sai-message-content">
                    {message.content}
                  </div>

                  <span className="chat-with-sai-message-time">
                    Now
                  </span>

                </div>
              )
            )}

            {/* ==================================================
                TYPING INDICATOR
            ================================================== */}

            {isTyping && (
              <div className="chat-with-sai-message assistant">

                <div className="chat-with-sai-message-content chat-with-sai-typing">

                  <span />
                  <span />
                  <span />

                </div>

              </div>
            )}

          </div>

          {/* ====================================================
              INPUT
          ==================================================== */}

          <div className="chat-with-sai-input-area">

            <input
              type="text"
              className="chat-with-sai-input"
              placeholder="Ask me anything..."
              value={chatInput}
              onChange={(event) =>
                setChatInput(
                  event.target.value
                )
              }
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              data-cursor="disable"
            />

            <button
              type="button"
              className="chat-with-sai-send"
              onClick={sendMessage}
              disabled={
                isTyping ||
                !chatInput.trim()
              }
              data-cursor="disable"
              aria-label="Send message"
            >
              →
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ChatWithSai;