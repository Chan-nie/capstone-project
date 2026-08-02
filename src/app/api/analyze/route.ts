/**
 * route.ts
 * --------
 * POST /api/analyze
 */

import { GoogleGenAI, Type } from "@google/genai";
import { MODEL, MAX_TOKENS, SYSTEM_PROMPT } from "@/lib/aiConfig";
import { getPageMetadata, getPageMetadataDeclaration } from "@/lib/tools/getPageMetadata";

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

  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: input }] },
  ];

  const encoder = new TextEncoder();
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
        let currentContents = [...contents];
        let done = false;

        while (!done) {
          const genStream = await ai.models.generateContentStream({
            model: MODEL,
            contents: currentContents,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              maxOutputTokens: MAX_TOKENS,
              abortSignal: abortController.signal,
              tools: [{ functionDeclarations: [getPageMetadataDeclaration] }],
            },
          });

          let pendingCall: { name: string; args: Record<string, unknown> } | null = null;
          let exactCallPart: any = null; // THIS IS THE NEW FIX
          let announced = false;

          for await (const chunk of genStream) {
            if (abortController.signal.aborted) break;

            // We MUST grab the raw part directly from candidates to keep thought_signature
            if (!exactCallPart && chunk.candidates?.[0]?.content?.parts) {
              const found = chunk.candidates[0].content.parts.find((p: any) => p.functionCall);
              if (found) exactCallPart = found;
            }

            const calls = chunk.functionCalls;
            if (calls && calls.length > 0) {
              const call = calls[0];
              pendingCall = { name: call.name!, args: call.args ?? {} };

              if (!announced) {
                send("tool-input-streaming", { toolName: call.name });
                announced = true;
              }
              send("tool-input-available", { toolName: call.name, input: pendingCall.args });
              continue;
            }

            const text = chunk.text;
            if (text) send("token", { text });
          }

          if (abortController.signal.aborted) break;

          if (pendingCall?.name === "getPageMetadata") {
            try {
              const result = await getPageMetadata(pendingCall.args as any);
              send("tool-output-available", { toolName: pendingCall.name, output: result });

              const callId = exactCallPart?.functionCall?.id;
              const responsePart: any = { 
                functionResponse: { name: pendingCall.name, response: result } 
              };
              if (callId) {
                responsePart.functionResponse.id = callId;
              }

              // Feed back the exact raw part
              currentContents = [
                ...currentContents,
                { role: "model", parts: [exactCallPart || { functionCall: { name: pendingCall.name, args: pendingCall.args } }] },
                { role: "user", parts: [responsePart] },
              ];
              continue;
            } catch (err) {
              const message = err instanceof Error ? err.message : "Tool execution failed.";
              send("tool-output-error", { toolName: pendingCall.name, error: message });
              done = true;
              break;
            }
          }

          done = true;
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