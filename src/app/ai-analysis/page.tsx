import StreamingAnalysis from "@/components/StreamingAnalysis";

export const metadata = {
  title: "AI Analysis — Streaming Chat",
  description: "A streaming AI analysis interface built for FE-06.",
};

export default function AIAnalysisPage() {
  return (
    <main style={{ height: "calc(100dvh - 64px)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 16px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 4 }}>AI Analysis</h1>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          Paste text or data below to get a streamed AI-generated summary.
        </p>
      </div>
      <StreamingAnalysis />
    </main>
  );
}
