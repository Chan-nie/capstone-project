import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import StreamingAnalysis from "../StreamingAnalysis";
import { sseResponse } from "@/test/mockSSE";

describe("StreamingAnalysis", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("fills the input when the example prompt is used", async () => {
    const user = userEvent.setup();
    render(<StreamingAnalysis />);
    await user.click(screen.getByRole("button", { name: /try an example/i }));
    expect(screen.getByRole("textbox")).toHaveValue("Q3 revenue grew 12% YoY to $4.2M, driven by a 30% jump in enterprise signups, while churn ticked up from 3% to 4.1% in the SMB segment.");
  });

  it("disables the send button until there is input", async () => {
    const user = userEvent.setup();
    render(<StreamingAnalysis />);
    expect(screen.getByRole("button", { name: /^send$/i })).toBeDisabled();
    await user.type(screen.getByRole("textbox"), "hello");
    expect(screen.getByRole("button", { name: /^send$/i })).toBeEnabled();
  });

  it("shows a thinking indicator, then streams in the assistant reply", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      sseResponse(
        [
          { event: "token", data: { text: "Hello " } },
          { event: "token", data: { text: "there." } },
          { event: "done", data: {} },
        ],
        { delayMs: 20 }
      )
    );

    const user = userEvent.setup();
    render(<StreamingAnalysis />);
    await user.type(screen.getByRole("textbox"), "hi");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    await waitFor(() => expect(screen.getByText("Hello there.")).toBeInTheDocument(), {
      timeout: 5000,
    });
  });

  it("shows a retry option when the route reports a stream error", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      sseResponse([{ event: "error", data: { message: "The analysis stopped unexpectedly." } }])
    );

    const user = userEvent.setup();
    render(<StreamingAnalysis />);
    await user.type(screen.getByRole("textbox"), "hi");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    expect(await screen.findByText(/analysis stopped unexpectedly/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("surfaces a rate-limit message on a 429 response", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Rate limited" }), { status: 429 })
    );

    const user = userEvent.setup();
    render(<StreamingAnalysis />);
    await user.type(screen.getByRole("textbox"), "hi");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    expect(await screen.findByText(/getting a lot of requests/i)).toBeInTheDocument();
  });

  it("renders a tool-call card when the assistant calls getPageMetadata", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      sseResponse([
        { event: "tool-input-streaming", data: { toolName: "getPageMetadata" } },
        { event: "tool-input-available", data: { toolName: "getPageMetadata", input: { url: "https://a.com" } } },
        { event: "tool-output-available", data: { toolName: "getPageMetadata", output: { title: "A", description: "B" } } },
        { event: "done", data: {} },
      ])
    );

    const user = userEvent.setup();
    render(<StreamingAnalysis />);
    await user.type(screen.getByRole("textbox"), "check this url");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    expect(await screen.findByText(/A/)).toBeInTheDocument();
    expect(screen.getByText(/B/)).toBeInTheDocument();
  });
});