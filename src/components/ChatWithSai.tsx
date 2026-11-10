import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import {
  FiArrowUpRight,
  FiUser,
  FiMessageCircle,
  FiChevronDown,
} from "react-icons/fi";

import { config } from "../config";
import "./styles/ChatWithSai.css";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const IGRIS_AVATAR = "/images/igris-avatar.png";

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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm IGRIS, Sai Teja's AI portfolio assistant. Ask me about his projects, technical skills, experience, or anything you'd like to know. 😊",
    },
  ]);

  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  // Enable independent chat scrolling only after the visitor
  // sends their first message.
  const hasConversation = chatMessages.some(
    (message) => message.role === "user"
  );

  // Automatically scroll to the latest message.
  useEffect(() => {
    const container = messagesRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [chatMessages, isTyping]);

  // Navigate to the Contact section.
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Send message to the existing chat API.
  const sendMessage = async () => {
    const trimmedInput = chatInput.trim();

    if (!trimmedInput || isTyping) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmedInput,
    };

    const conversationMessages = [
      ...chatMessages,
      userMessage,
    ];

    setChatMessages(conversationMessages);
    setChatInput("");
    setIsTyping(true);

    try {
      const messages = [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...conversationMessages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(
          `Chat request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const content =
        data?.choices?.[0]?.message?.content;

      if (typeof content !== "string") {
        throw new Error("Invalid chat response");
      }

      setChatMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setChatMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Enter-to-send functionality.
  const handleKeyPress = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <section
      className="chat-with-sai-section"
      id="chat-with-sai"
    >
      <div className="chat-with-sai-container">

        {/* HEADING */}

        <div className="chat-with-sai-heading">
          <span className="chat-with-sai-eyebrow">
            ✦ LETS HAVE A TALK
          </span>

          <h2>
            Chat with my AI <span>IGRIS</span>
          </h2>

          <p>
            Ask me about my projects, skills, experience, AI,
            software development, or anything else you'd like
            to know.
          </p>
        </div>

        {/* CHAT INTERFACE */}

        <div className="chat-with-sai-card">

          {/* CHAT HEADER */}

          <div className="chat-with-sai-header">
            <div className="chat-with-sai-title">

              <div className="chat-with-sai-avatar">
                <img
                  src={IGRIS_AVATAR}
                  alt="IGRIS AI avatar"
                />
              </div>

              <div className="chat-with-sai-identity">
                <strong>IGRIS</strong>

                <span className="chat-with-sai-online">
                  <i />
                  AI Assistant
                </span>
              </div>

            </div>

            <div className="chat-with-sai-ai-badge">
              <FiMessageCircle />
              <span>AI ASSISTED</span>
            </div>
          </div>

          {/* MESSAGES */}

          <div
            ref={messagesRef}
            className={`chat-with-sai-messages ${
              hasConversation
                ? "has-conversation"
                : "empty-conversation"
            }`}
            data-lenis-prevent={
              hasConversation ? "" : undefined
            }
            aria-live="polite"
            aria-label="Chat messages"
          >
            {chatMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-with-sai-message ${message.role}`}
              >

                {/* MESSAGE AVATAR */}

                <div className="chat-message-avatar">
                  {message.role === "assistant" ? (
                    <img
                      src={IGRIS_AVATAR}
                      alt=""
                      aria-hidden="true"
                    />
                  ) : (
                    <FiUser />
                  )}
                </div>

                {/* MESSAGE CONTENT */}

                <div className="chat-message-body">
                  <div className="chat-with-sai-message-content">
                    {message.content}
                  </div>

                  <span className="chat-with-sai-message-time">
                    {message.role === "user" ? "You" : "IGRIS"}
                  </span>
                </div>

              </div>
            ))}

            {/* TYPING INDICATOR */}

            {isTyping && (
              <div className="chat-with-sai-message assistant">

                <div className="chat-message-avatar">
                  <img
                    src={IGRIS_AVATAR}
                    alt=""
                    aria-hidden="true"
                  />
                </div>

                <div className="chat-message-body">
                  <div className="chat-with-sai-message-content chat-with-sai-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* INPUT AREA */}

          <form
            className="chat-with-sai-input-area"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              type="text"
              className="chat-with-sai-input"
              placeholder="Ask IGRIS anything..."
              value={chatInput}
              onChange={(event) =>
                setChatInput(event.target.value)
              }
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              aria-label="Write your message"
              data-cursor="disable"
            />

            <button
              type="submit"
              className="chat-with-sai-send"
              disabled={isTyping || !chatInput.trim()}
              aria-label="Send message"
              data-cursor="disable"
            >
              <FiArrowUpRight />
            </button>
          </form>

          {/* FOOTER */}

          <div className="chat-with-sai-footer">
            <span>
              Powered by intelligence. Designed by Sai Teja.
            </span>
          </div>

        </div>

        {/* SCROLL TO CONTACT BUTTON */}

        <button
          type="button"
          className="chat-scroll-hint"
          aria-label="Scroll to the Contact section"
          onClick={scrollToContact}
        >
          <span>SCROLL TO EXPLORE</span>

          <FiChevronDown className="chat-scroll-arrow" />
        </button>

      </div>
    </section>
  );
};

export default ChatWithSai;