"use client";

import { useEffect } from "react";

/**
 * Route-level boundary for /ai-analysis.
 *
 * This catches failures in rendering/loading the page itself (e.g. a
 * thrown error during the server component render). It is NOT where
 * in-chat streaming failures go — those are handled inside
 * useStreamingAnalysis + StreamingAnalysis.tsx via status === "error",
 * since a stream failure shouldn't tear down the whole page, just that
 * one exchange.
 */
export default function AIAnalysisError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      style={{
        height: "calc(100dvh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
        textAlign: "center",
      }}
    >
      <p style={{ color: "#666", fontSize: "0.95rem" }}>
        This page hit an unexpected error.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "10px 18px",
          borderRadius: 10,
          border: "none",
          background: "#2563eb",
          color: "white",
          fontWeight: 600,
          fontSize: "0.9rem",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </main>
  );
}
