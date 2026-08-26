/**
 * StreamingAnalysis.tsx
 * -----------------------
 * The UI half of FE-06. All streaming/state logic lives in
 * useStreamingAnalysis — this file is just render + scroll behavior.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useStreamingAnalysis } from "@/hooks/useStreamingAnalysis";
import styles from "./StreamingAnalysis.module.css";
import ToolCallCard from "./ToolCallCard";

const EXAMPLE_PROMPT =
  "Q3 revenue grew 12% YoY to $4.2M, driven by a 30% jump in enterprise signups, while churn ticked up from 3% to 4.1% in the SMB segment.";

export default function StreamingAnalysis() {
  const { messages, status, errorMessage, send, stop, retry } = useStreamingAnalysis();
  const [input, setInput] = useState("");
  const [retrying, setRetrying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPinnedRef = useRef(true); 
  const [showJump, setShowJump] = useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const pinned = distanceFromBottom < 48;
    isPinnedRef.current = pinned;
    setShowJump(!pinned);
  };

  useEffect(() => {
    if (isPinnedRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const jumpToLatest = () => {
    isPinnedRef.current = true;
    setShowJump(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput("");
    isPinnedRef.current = true;
    setShowJump(false);
  };

  const isBusy = status === "thinking" || status === "streaming";

  return (
    <div className={styles.container}>
      <div className={styles.messages} ref={scrollRef} onScroll={handleScroll}>
        {messages.length === 0 && (
          <div className={styles.empty}>
            <button
              type="button"
              className={styles.exampleBtn}
              onClick={() => setInput(EXAMPLE_PROMPT)}
            >
              Try an example →
            </button>
          </div>
        )}

        {messages.map((m, i) => {
          const isLastAssistant = m.role === "assistant" && i === messages.length - 1;
          const showThinking = isLastAssistant && status === "thinking" && m.content === "";

          return (
            <div
              key={m.id}
              className={`${styles.message} ${
                m.role === "user" ? styles.messageUser : styles.messageAssistant
              }`}
            >
              {/* The New Avatar Rendering Block */}
              {m.role === "assistant" && (
                <div className={`${styles.avatar} ${showThinking ? styles.avatarPulse : ""}`}>
                  <Image src="/images/S-favicon.jpg" alt="AI" width={28} height={28} />
                </div>
              )}

              {/* Wrapped in messageContent so it aligns next to the avatar */}
              <div className={styles.messageContent}>
                {m.toolCall && <ToolCallCard toolCall={m.toolCall} />}
                <div className={styles.bubble}>
                  {showThinking ? (
                    <ThinkingIndicator />
                  ) : (
                    <TypewriterText
                      content={m.content}
                      active={isLastAssistant && status === "streaming"}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {status === "error" && (
          <div className={styles.error}>
            <span>{errorMessage ?? "Something went wrong."}</span>
            <button
              type="button"
              className={styles.retryBtn}
              disabled={retrying}
              onClick={async () => {
                if (retrying) return; 
                setRetrying(true);
                try {
                  retry(); 
                } finally {
                  setTimeout(() => setRetrying(false), 400);
                }
              }}
            >
              {retrying ? "Retrying…" : "Retry"}
            </button>
          </div>
        )}
      </div>

      {showJump && (
        <button className={styles.jumpBtn} onClick={jumpToLatest} type="button">
          ↓ Jump to latest
        </button>
      )}

      <form className={styles.inputRow} onSubmit={handleSubmit}>
        <textarea
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text to analyze..."
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        {isBusy ? (
          <button type="button" className={`${styles.btn} ${styles.btnStop}`} onClick={stop}>
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnSend}`}
            disabled={!input.trim()}
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}

function TypewriterText({ content, active }: { content: string; active: boolean }) {
  const [displayLength, setDisplayLength] = useState(0);
  const contentRef = useRef(content);

  // 1. Pure ref sync (satisfies the refs linter)
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // 2. Typewriter interval
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setDisplayLength((prev) => {
        const target = contentRef.current.length;
        if (prev >= target) return prev;
        return Math.min(prev + 2, target); 
      });
    }, 16);
    return () => clearInterval(id);
  }, [active]);

  // 3. Snap to end when stopped
  // We use the ref here, so we only need 'active' in the dependency array.
  // This keeps the array size at 1, preventing the Turbopack crash!
  useEffect(() => {
    if (!active) {
      setDisplayLength(contentRef.current.length);
    }
  }, [active]);

  return (
    <p className={styles.text}>
      {content.slice(0, displayLength)}
      {active && displayLength < content.length && <span className={styles.cursor} />}
    </p>
  );
}

function ThinkingIndicator() {
  return (
    <span className={styles.thinking} aria-label="Analyzing">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  );
}