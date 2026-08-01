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
export type ChatMessage = { id: string; role: ChatRole; content: string };
export type Status = "idle" | "thinking" | "streaming" | "error";

export function useStreamingAnalysis(endpoint = "/api/analyze") {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    // Aborting the fetch closes the connection; the server's req.signal
    // 'abort' listener (see route.ts) picks that up and cancels the
    // upstream Gemini call. We deliberately do NOT touch `messages` here —
    // whatever partial assistant text has streamed in so far stays as-is.
    abortControllerRef.current?.abort();
    setStatus("idle");
  }, []);

  const send = useCallback(
    async (input: string) => {
      if (!input.trim() || status === "thinking" || status === "streaming") return;

      const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: input };
      const assistantId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        userMessage,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setStatus("thinking"); // thinking indicator shows until first token arrives

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const historyForServer = [...messages, userMessage].map(({ role, content }) => ({
          role,
          content,
        }));

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, history: historyForServer.slice(0, -1) }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`Request failed: ${res.status}`);
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
              setStatus("error");
            } else if (event === "done") {
              setStatus("idle");
            }
          }
        }
        setStatus((s) => (s === "error" ? s : "idle"));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Expected path from stop() — already handled there.
          return;
        }
        setStatus("error");
      } finally {
        abortControllerRef.current = null;
      }
    },
    [endpoint, messages, status]
  );

  return { messages, status, send, stop };
}
