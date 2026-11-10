import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type KeyboardEvent,
} from "react";

import {
  FiArrowUpRight,
  FiUser,
  FiMessageCircle,
  FiChevronDown,
  FiTrash2,
  FiVolume2,
  FiVolumeX,
  FiSquare,
} from "react-icons/fi";

import "./styles/ChatWithSai.css";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const IGRIS_AVATAR = "/images/igris-avatar.png";

const INITIAL_GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hello! I'm IGRIS, Sai Teja's AI portfolio assistant. I can help you explore his background, technical skills, projects, education and professional experience. Ask me anything! 😊",
};

/**
 * Strips markdown symbols (bold, italic, list dashes, headings, code)
 * so speech synthesis pronounces clear, natural sentences.
 */
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/^[-*•]\s+/gm, "")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n+/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

const ChatWithSai = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Text-To-Speech (TTS) states
  const [autoTts, setAutoTts] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  // Typing animation state for assistant message streaming effect
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [typedLength, setTypedLength] = useState<number>(0);
  const typingTimerRef = useRef<number | null>(null);

  // Generate unique visitor session ID for isolated conversation memory
  const [sessionId] = useState(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  });

  const messagesRef = useRef<HTMLDivElement | null>(null);

  // Stop any active speech synthesis
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingIndex(null);
  }, []);

  // Stop any active typewriter animation and show full text
  const stopTypingAnimation = useCallback(() => {
    if (typingTimerRef.current !== null) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setTypingIndex(null);
  }, []);

  // Clean up timers and speech synthesis when unmounting
  useEffect(() => {
    return () => {
      stopTypingAnimation();
      stopSpeaking();
    };
  }, [stopTypingAnimation, stopSpeaking]);

  // Handle SpeechSynthesis speech triggering
  const speakMessage = useCallback(
    (index: number, text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        console.warn("Speech synthesis not supported in this environment");
        return;
      }

      // If already speaking this message, toggle off
      if (speakingIndex === index) {
        stopSpeaking();
        return;
      }

      stopSpeaking();

      const cleaned = cleanTextForSpeech(text);
      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Daniel") ||
              v.name.includes("David"))
        ) || voices.find((v) => v.lang.startsWith("en")) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setSpeakingIndex(index);
      };

      utterance.onend = () => {
        setSpeakingIndex(null);
      };

      utterance.onerror = (e) => {
        // Interrupted/canceled errors are expected on manual stop
        if (e.error !== "canceled" && e.error !== "interrupted") {
          console.warn("Speech synthesis error:", e);
        }
        setSpeakingIndex(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [speakingIndex, stopSpeaking]
  );

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
  }, [chatMessages, isTyping, typedLength]);

  // Navigate to the Contact section.
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Clear conversation session
  const clearChat = async () => {
    if (isTyping) return;
    stopTypingAnimation();
    stopSpeaking();

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          clearSession: true,
        }),
      });
    } catch (e) {
      console.warn("Failed to notify server of session clear:", e);
    }
    setChatMessages([INITIAL_GREETING]);
    setChatInput("");
  };

  // Toggle Auto-TTS
  const toggleAutoTts = () => {
    if (autoTts) {
      stopSpeaking();
      setAutoTts(false);
    } else {
      setAutoTts(true);
      // Speak the latest assistant message if available
      const lastIndex = chatMessages.length - 1;
      if (lastIndex >= 0 && chatMessages[lastIndex].role === "assistant") {
        speakMessage(lastIndex, chatMessages[lastIndex].content);
      }
    }
  };

  // Start typewriter animation for newly arrived assistant message
  const startTypewriter = (messageIndex: number, text: string) => {
    stopTypingAnimation();
    setTypingIndex(messageIndex);
    setTypedLength(0);

    const totalLength = text.length;
    let currentLength = 0;

    // Type 2-4 characters per frame (~18ms) for natural speed (~80 chars/sec)
    typingTimerRef.current = window.setInterval(() => {
      currentLength += Math.floor(Math.random() * 3) + 2;
      if (currentLength >= totalLength) {
        setTypedLength(totalLength);
        stopTypingAnimation();
      } else {
        setTypedLength(currentLength);
      }
    }, 18);
  };

  // Send message to the upgraded LLM chat API with session memory and RAG
  const sendMessage = async () => {
    const trimmedInput = chatInput.trim();

    if (!trimmedInput || isTyping) return;

    // Stop previous typing and speech
    stopTypingAnimation();
    stopSpeaking();

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmedInput,
    };

    const updatedMessages = [...chatMessages, userMessage];

    setChatMessages(updatedMessages);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedInput,
          sessionId,
          messages: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (typeof content !== "string") {
        throw new Error("Invalid chat response");
      }

      const newMsgIndex = updatedMessages.length;
      setChatMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content,
        },
      ]);

      // Trigger typewriter animation for the new response
      startTypewriter(newMsgIndex, content);

      // Trigger TTS if voice mode is on
      if (autoTts) {
        speakMessage(newMsgIndex, content);
      }
    } catch (error) {
      console.error("Chat error:", error);

      const errorText =
        "I'm having trouble connecting right now. Please try again in a moment.";
      const newMsgIndex = updatedMessages.length;

      setChatMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: errorText,
        },
      ]);

      startTypewriter(newMsgIndex, errorText);

      if (autoTts) {
        speakMessage(newMsgIndex, errorText);
      }
    } finally {
      setIsTyping(false);
    }
  };

  // Enter-to-send functionality.
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
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

            <div className="chat-with-sai-actions">
              <button
                type="button"
                className={`chat-with-sai-tts-toggle ${autoTts ? "active" : ""}`}
                onClick={toggleAutoTts}
                title={
                  autoTts
                    ? "Voice output enabled (click to mute)"
                    : "Voice output muted (click to enable)"
                }
                aria-label="Toggle voice output"
                data-cursor="disable"
              >
                {autoTts ? <FiVolume2 /> : <FiVolumeX />}
                <span>{autoTts ? "VOICE ON" : "VOICE"}</span>
              </button>

              <button
                type="button"
                className="chat-with-sai-clear-btn"
                onClick={clearChat}
                title="Clear conversation"
                aria-label="Clear chat conversation"
                data-cursor="disable"
              >
                <FiTrash2 />
                <span>Clear</span>
              </button>

              <div className="chat-with-sai-ai-badge">
                <FiMessageCircle />
                <span>AI ASSISTED</span>
              </div>
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
            {chatMessages.map((message, index) => {
              const isCurrentTyping = typingIndex === index;
              const displayedText = isCurrentTyping
                ? message.content.slice(0, typedLength)
                : message.content;

              return (
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
                    <div
                      className="chat-with-sai-message-content"
                      onClick={() => {
                        // Click on message bubble to instantly finish typewriter animation
                        if (isCurrentTyping) {
                          stopTypingAnimation();
                        }
                      }}
                      title={
                        isCurrentTyping
                          ? "Click to display full response immediately"
                          : undefined
                      }
                    >
                      {displayedText}
                      {isCurrentTyping && (
                        <span
                          className="chat-typing-cursor"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <div className="chat-message-meta">
                      <span className="chat-with-sai-message-time">
                        {message.role === "user" ? "You" : "IGRIS"}
                      </span>

                      {message.role === "assistant" && (
                        <button
                          type="button"
                          className={`chat-speak-btn ${
                            speakingIndex === index ? "speaking" : ""
                          }`}
                          onClick={() => speakMessage(index, message.content)}
                          title={
                            speakingIndex === index
                              ? "Stop speaking"
                              : "Listen to IGRIS's response"
                          }
                          aria-label={
                            speakingIndex === index
                              ? "Stop listening"
                              : "Listen to IGRIS's response"
                          }
                          data-cursor="disable"
                        >
                          {speakingIndex === index ? (
                            <>
                              <FiSquare style={{ fontSize: "9px" }} />
                              <span style={{ marginLeft: "4px" }}>Stop</span>
                            </>
                          ) : (
                            <>
                              <FiVolume2 style={{ fontSize: "11px" }} />
                              <span style={{ marginLeft: "4px" }}>Listen</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

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