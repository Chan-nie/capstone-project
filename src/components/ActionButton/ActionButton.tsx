"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ActionButton.module.css";

type ButtonState = "idle" | "loading" | "success" | "error";

interface ActionButtonProps {
  /** Text shown in idle state, e.g. "Send" */
  label: string;
  /** Text shown while the async action runs, e.g. "Sending…" */
  loadingLabel?: string;
  /** Text shown briefly on success, e.g. "Sent" */
  successLabel?: string;
  /** Text shown on failure — doubles as the retry prompt */
  errorLabel?: string;
  /**
   * The async work this button performs. Throw (or reject) to signal
   * failure — the component doesn't care why, only whether it resolved.
   */
  onAction: () => Promise<void>;
  /** How long the success state holds before returning to idle (ms) */
  successHoldMs?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * A button that narrates its own lifecycle: idle -> loading -> success/error -> idle.
 *
 * Design notes (why these specific numbers):
 * - Hover/press feedback is fast (120–150ms) because it's confirming a gesture
 *   that already happened — the eye expects it almost instantly.
 * - The idle -> loading transition is slower (320ms) and uses an ease-out
 *   curve, because it's introducing new information (the spinner, a width
 *   change) and an abrupt cut would read as a glitch, not a state.
 * - Success uses a quick overshoot (cubic-bezier springy pop) because success
 *   is a small reward — a tiny bit of bounce reads as "done!" without being
 *   cartoonish.
 * - Error uses a short, sharp shake (4 oscillations, 400ms total) because it
 *   needs to register as "something went wrong" fast, then get out of the way.
 * - All of this is skipped/flattened under prefers-reduced-motion — see the
 *   CSS file — but the color and label changes (the actual information)
 *   always still happen. Motion is decoration on top of state, never the
 *   only carrier of it.
 */
export default function ActionButton({
  label,
  loadingLabel = "Loading…",
  successLabel = "Done",
  errorLabel = "Retry",
  onAction,
  successHoldMs = 1100,
  disabled = false,
  className = "",
}: ActionButtonProps) {
  const [state, setState] = useState<ButtonState>("idle");
  const [shakeKey, setShakeKey] = useState(0);

  // Tracks the "in-flight" call so a stray resolution from an old click
  // (if we ever allow overlapping calls) can't clobber a newer state.
  const callId = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = useCallback(async () => {
    // Ignore clicks while a call is already in flight — this is what makes
    // spam-clicking safe. The button is also visually/functionally disabled
    // during loading (see JSX below), this is a belt-and-suspenders guard.
    if (state === "loading") return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const thisCall = ++callId.current;
    setState("loading");

    try {
      await onAction();
      if (callId.current !== thisCall) return; // superseded, bail quietly
      setState("success");
      timeoutRef.current = setTimeout(() => {
        if (callId.current === thisCall) setState("idle");
      }, successHoldMs);
    } catch {
      if (callId.current !== thisCall) return;
      setState("error");
      setShakeKey((k) => k + 1); // re-trigger the shake keyframe even on repeat errors
    }
  }, [state, onAction, successHoldMs]);

  const isDisabled = disabled || state === "loading";

  const displayLabel =
    state === "loading"
      ? loadingLabel
      : state === "success"
      ? successLabel
      : state === "error"
      ? errorLabel
      : label;

  return (
    <button
      type="button"
      className={`${styles.button} ${styles[state]} ${className}`}
      onClick={handleClick}
      disabled={isDisabled}
      aria-live="polite"
      aria-busy={state === "loading"}
      data-shake={shakeKey}
    >
      <span
        key={shakeKey}
        className={`${styles.content} ${state === "error" ? styles.shaking : ""}`}
      >
        <span className={styles.label}>{displayLabel}</span>

        <span className={styles.spinner} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.spinnerSvg}>
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              strokeWidth="3"
              className={styles.spinnerTrack}
            />
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              strokeWidth="3"
              className={styles.spinnerArc}
            />
          </svg>
        </span>

        <span className={styles.check} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.checkSvg}>
            <path
              d="M4 12.5L9.5 18L20 6.5"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.checkPath}
            />
          </svg>
        </span>
      </span>
    </button>
  );
}