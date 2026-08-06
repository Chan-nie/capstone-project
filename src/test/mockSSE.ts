export function sseResponse(
  events: Array<{ event: string; data: unknown }>,
  opts?: { delayMs?: number }
) {
  const encoder = new TextEncoder();
  const delay = opts?.delayMs ?? 0;
  const stream = new ReadableStream({
    async start(controller) {
      for (const { event, data } of events) {
        if (delay) await new Promise((r) => setTimeout(r, delay));
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      }
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}