"use client";

import ActionButton from "@/components/ActionButton/ActionButton";

/** Fake async work: random delay, 20% failure rate — per the brief. */
function fakeRequest(minMs = 700, maxMs = 1600, failRate = 0.2): Promise<void> {
  const delay = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) reject(new Error("Simulated failure"));
      else resolve();
    }, delay);
  });
}

export default function ButtonDemoPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "48px",
        padding: "24px",
        background: "linear-gradient(160deg, #fdf3f6 0%, #eef4fb 100%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <h1 style={{ fontSize: 22, marginBottom: 8, color: "#5c3a49" }}>
          Buttons with a Brain
        </h1>
        <p style={{ fontSize: 14, color: "#7a6570", lineHeight: 1.5 }}>
          Click either button. Each call has a random 700–1600ms delay and a
          20% simulated failure rate, so you'll see both success and error
          states firing naturally — click enough times and you'll hit both.
          Try spam-clicking, hovering mid-animation, and tabbing to the
          button with your keyboard.
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        <ActionButton
          label="Send message"
          loadingLabel="Sending"
          successLabel="Sent"
          errorLabel="Retry"
          onAction={() => fakeRequest()}
        />

        <ActionButton
          label="Save draft"
          loadingLabel="Saving"
          successLabel="Saved"
          errorLabel="Retry"
          onAction={() => fakeRequest(500, 1200, 0.2)}
        />
      </div>

      <section
        style={{
          maxWidth: 520,
          fontSize: 13,
          lineHeight: 1.6,
          color: "#6b5a63",
          background: "rgba(255,255,255,0.6)",
          borderRadius: 12,
          padding: "16px 20px",
        }}
      >
        <strong>Duration &amp; easing notes:</strong> Hover/press feedback is
        fast (120–150ms) because it confirms a gesture that already
        happened. The idle→loading shift is slower (320ms, ease-out) since
        it introduces new information — a snap here would read as a glitch.
        Success uses a springy overshoot (cubic-bezier with slight bounce)
        because success is a small reward. Error shakes sharply for 400ms
        then gets out of the way, and the shake lives on the inner content
        layer so it never fights the button's own hover transform. Under{" "}
        <code>prefers-reduced-motion</code>, the lift, bounce, spin, and
        shake are all removed or flattened to opacity crossfades — but
        color and label always still change, so state is never silent.
      </section>
    </main>
  );
}