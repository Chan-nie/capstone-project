import StreamingAnalysis from "@/components/StreamingAnalysis";

export const metadata = {
  title: "AI Analysis — Streaming Chat",
  description: "A streaming AI analysis interface built for FE-06.",
};

export default function AIAnalysisPage() {
  return (
    <main style={{ height: "calc(100dvh - 64px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "16px 16px 0", textAlign: "center", flexShrink: 0 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 4 }}>
          AI Core Assistant
        </h1>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          Ask me anything about my portfolio, tech stack, or drop text to analyze.
        </p>
      </div>
      <StreamingAnalysis />
    </main>
  );
}