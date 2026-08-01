/**
 * StreamingAnalysis.tsx
 * -----------------------
 * The UI half of FE-06. All streaming/state logic lives in
 * useStreamingAnalysis — this file is just render + scroll behavior.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { useStreamingAnalysis } from "@/hooks/useStreamingAnalysis";
import styles from "./StreamingAnalysis.module.css";

export default function StreamingAnalysis() {
  const { messages, status, send, stop } = useStreamingAnalysis();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPinnedRef = useRef(true); // are we currently glued to the bottom?
  const [showJump, setShowJump] = useState(false);

  // --- Scroll-pin logic ---
  // Pin to bottom only while the user is already at (or very near) the
  // bottom. The moment they scroll up, release the pin so streaming text
  // doesn't yank them back down mid-read.
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
            Paste some text or data below and I&apos;ll analyze it for you.
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
          );
        })}

        {status === "error" && <div className={styles.error}>Something went wrong. Try again.</div>}
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

/**
 * Reveals `content` character-by-character at a steady pace, independent
 * of how the underlying network chunks arrived. Gemini streams in bursts
 * (a sentence or two per chunk) rather than single tokens — without this,
 * text visually "pops" in blocks. This decouples display rate from
 * network rate: displayLength always chases content.length, never
 * outruns it, and snaps to the full text the instant streaming stops
 * (so the Stop button never leaves text visibly lagging behind).
 */
function TypewriterText({ content, active }: { content: string; active: boolean }) {
  const [displayLength, setDisplayLength] = useState(0);
  const contentRef = useRef(content);
  contentRef.current = content;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setDisplayLength((prev) => {
        const target = contentRef.current.length;
        if (prev >= target) return prev;
        return Math.min(prev + 2, target); // ~2 chars per 16ms ≈ 125 chars/sec
      });
    }, 16);
    return () => clearInterval(id);
  }, [active]);

  // The moment streaming ends (finished OR stopped), show everything that
  // actually arrived immediately — no trailing lag on the partial message.
  useEffect(() => {
    if (!active) setDisplayLength(contentRef.current.length);
  }, [active, content]);

  return (
    <p className={styles.text}>
      {content.slice(0, displayLength)}
      {active && displayLength < content.length && <span className={styles.cursor} />}
    </p>
  );
}

/**
 * Thinking indicator. The handoff to text is a CSS crossfade (see
 * StreamingAnalysis.module.css) rather than an abrupt swap.
 */
function ThinkingIndicator() {
  return (
    <span className={styles.thinking} aria-label="Analyzing">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  );
}