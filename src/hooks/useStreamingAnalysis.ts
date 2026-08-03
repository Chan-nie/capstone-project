/**
 * useStreamingAnalysis.ts
 * ------------------------
 * Hand-rolled equivalent of `useChat`, scoped to this app's needs.
 *
 * Owns:
 *  - messages[]   conversation history, survives multiple turns
 *  - status       'idle' | 'thinking' | 'streaming' | 'error'
 *  - send(input)  kicks off a new turn
 *  - stop()       aborts mid-stream WITHOUT losing partial text
 *
 * The "stop, then send again" test is the reason this is a hook and not
 * logic buried in the component: stop() only ever touches the
 * abortController + status, it never mutates messages in a way that
 * would leave the array in a broken shape for the next send.
 */
"use client";

import { useCallback, useRef, useState } from "react";

export type ChatRole = "user" | "assistant";

export type ToolCallState =
  | { status: "input-streaming"; toolName: string }
  | { status: "input-available"; toolName: string; input: { url: string } }
  | { status: "output-available"; toolName: string; output: Record<string, unknown> }
  | { status: "output-error"; toolName: string; error: string };

export type ChatMessage = { id: string; role: ChatRole; content: string; toolCall?: ToolCallState };
export type Status = "idle" | "thinking" | "streaming" | "error";

export function useStreamingAnalysis(endpoint = "/api/analyze") {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // The exact input + message ids of the exchange that's currently in an
  // error state, so retry() can resend ONLY that turn — not the whole
  // conversation — and swap it back out cleanly if the retry succeeds.
  const failedTurnRef = useRef<{ input: string; userId: string; assistantId: string } | null>(
    null
  );

  const stop = useCallback(() => {
    // Aborting the fetch closes the connection; the server's req.signal
    // 'abort' listener (see route.ts) picks that up and cancels the
    // upstream Gemini call. We deliberately do NOT touch `messages` here —
    // whatever partial assistant text has streamed in so far stays as-is.
    abortControllerRef.current?.abort();
    setStatus("idle");
  }, []);

  const send = useCallback(
    async (input: string, replaceIds?: { userId: string; assistantId: string }) => {
      if (!input.trim() || status === "thinking" || status === "streaming") return;

      const userId = replaceIds?.userId ?? crypto.randomUUID();
      const assistantId = replaceIds?.assistantId ?? crypto.randomUUID();
      const userMessage: ChatMessage = { id: userId, role: "user", content: input };

      setErrorMessage(null);
      failedTurnRef.current = null;

      setMessages((prev) => {
        // Retrying: drop the previous failed pair before re-adding it,
        // so the conversation doesn't accumulate duplicate turns.
        const base = replaceIds
          ? prev.filter((m) => m.id !== replaceIds.userId && m.id !== replaceIds.assistantId)
          : prev;
        return [...base, userMessage, { id: assistantId, role: "assistant", content: "" }];
      });
      setStatus("thinking"); // thinking indicator shows until first token arrives

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const fail = (message: string) => {
        failedTurnRef.current = { input, userId, assistantId };
        setErrorMessage(message);
        setStatus("error");
      };

      try {
        const historyForServer = messages
          .filter((m) => m.id !== userId && m.id !== assistantId)
          .map(({ role, content }) => ({ role, content }));

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, history: historyForServer }),
          signal: controller.signal,
        });

        if (res.status === 429) {
          fail("The AI service is getting a lot of requests right now. Wait a moment and retry.");
          return;
        }

        if (!res.ok || !res.body) {
          let detail = "";
          try {
            const body = await res.json();
            detail = body?.error ?? "";
          } catch {
            // response wasn't JSON — ignore, fall back to generic message
          }
          fail(detail || `Request failed (${res.status}). Please retry.`);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let firstTokenReceived = false;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            const eventLine = frame.split("\n").find((l) => l.startsWith("event:"));
            const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
            if (!eventLine || !dataLine) continue;

            const event = eventLine.replace("event:", "").trim();
            const data = JSON.parse(dataLine.replace("data:", "").trim());

            if (event === "token") {
              if (!firstTokenReceived) {
                firstTokenReceived = true;
                setStatus("streaming"); // hand off: indicator -> live text
              }
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + data.text } : m
                )
              );
} else if (event === "error") {
              fail(data.message || "The analysis stopped unexpectedly. Please retry.");
            } else if (event === "done") {
              setStatus("idle");
            } else if (event === "tool-input-streaming") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, toolCall: { status: "input-streaming", toolName: data.toolName } }
                    : m
                )
              );
            } else if (event === "tool-input-available") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, toolCall: { status: "input-available", toolName: data.toolName, input: data.input } }
                    : m
                )
              );
            } else if (event === "tool-output-available") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, toolCall: { status: "output-available", toolName: data.toolName, output: data.output } }
                    : m
                )
              );
            } else if (event === "tool-output-error") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, toolCall: { status: "output-error", toolName: data.toolName, error: data.error } }
                    : m
                )
              );
            }
          }
        }
        setStatus((s) => (s === "error" ? s : "idle"));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Expected path from stop() — already handled there.
          return;
        }
        // fetch() itself rejects (not just a bad status) when the network
        // is down or the connection drops mid-flight — that's the
        // "offline before send" and "killed mid-stream" sabotage cases.
        fail("Couldn't reach the server. Check your connection and retry.");
      } finally {
        abortControllerRef.current = null;
      }
    },
    [endpoint, messages, status]
  );

  const retry = useCallback(() => {
    const failed = failedTurnRef.current;
    if (!failed || status === "thinking" || status === "streaming") return;
    send(failed.input, { userId: failed.userId, assistantId: failed.assistantId });
  }, [send, status]);

  return { messages, status, errorMessage, send, stop, retry };
}
