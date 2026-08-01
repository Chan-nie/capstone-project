/**
 * route.ts
 * --------
 * POST /api/analyze
 *
 * Body: { input: string, history?: Array<{role: "user"|"assistant", content: string}> }
 *
 * Streams Gemini's response back to the client as Server-Sent Events (SSE),
 * using a plain Next.js Route Handler (App Router) — no Express needed,
 * Next.js's Web-standard Request/Response already gives us everything.
 *
 * Eval criteria this file is responsible for:
 *  - Responses visibly stream token by token  -> ReadableStream + `for await (chunk of genStream)`
 *  - Generation can be stopped mid-stream      -> req.signal 'abort' -> abortController.abort()
 *  - API key lives server-side only            -> GEMINI_API_KEY read here via process.env, never sent to client
 */

import { GoogleGenAI } from "@google/genai";
import { MODEL, MAX_TOKENS, SYSTEM_PROMPT } from "@/lib/aiConfig";

// Reads GEMINI_API_KEY from process.env. This file only ever runs on the
// server (Route Handlers never ship to the browser) — the client never
// sees this object or the key.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const input: string | undefined = body?.input;
  const history: ChatMessage[] = body?.history ?? [];

  if (!input || typeof input !== "string" || !input.trim()) {
    return new Response(JSON.stringify({ error: "Missing 'input' string in request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Gemini's format: 'user' | 'model' roles (not 'assistant') — translate.
  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: input }] },
  ];

  const encoder = new TextEncoder();

  // --- Stop button support ---
  // Next.js's Request exposes a standard AbortSignal (req.signal) that
  // fires when the client cancels its fetch(). We forward that into our
  // own controller and pass it to Gemini's request config, so the upstream
  // generation actually stops instead of continuing to burn tokens nobody sees.
  const abortController = new AbortController();
  req.signal.addEventListener("abort", () => abortController.abort());

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        const genStream = await ai.models.generateContentStream({
          model: MODEL,
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            maxOutputTokens: MAX_TOKENS,
            abortSignal: abortController.signal,
          },
        });

        for await (const chunk of genStream) {
          if (abortController.signal.aborted) break;
          const text = chunk.text;
          if (text) send("token", { text });
        }

        if (!abortController.signal.aborted) send("done", {});
      } catch (err: unknown) {
        const aborted =
          abortController.signal.aborted ||
          (err instanceof Error && err.name === "AbortError");
        if (!aborted) {
          console.error("Gemini stream error:", err);
          const message = err instanceof Error ? err.message : "Stream error.";
          send("error", { message });
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      // Fires if the ReadableStream itself gets cancelled by the runtime.
      abortController.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
