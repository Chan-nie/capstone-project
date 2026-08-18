/**
 * aiConfig.ts
 * -----------
 * Single source of truth for how this app talks to the model.
 * FE-06 asks for "system prompt and model config in one well-commented
 * module" because FE-07 extends this route — keep this file clean and
 * don't let prompt strings leak into the route handler.
 *
 * Using Gemini instead of Claude here — confirmed fine with the FlyRank
 * mentor (Anthropic has no free tier; Gemini does). The route handler in
 * src/app/api/analyze/route.ts is the only other file that's provider-specific.
 */

// Verify the current model string in Google's docs before shipping —
// model names get versioned/retired. 'gemini-2.5-flash' is a solid free-tier
// default: fast, cheap-to-free, good enough for a summarization task.
export const MODEL = "gemini-3.6-flash";

// Keep max output conservative for a "summary/analysis" feature — this
// isn't a long-form generator, so capping output keeps latency down.
export const MAX_TOKENS = 1024;

// This is the ONE place the system prompt lives.
export const SYSTEM_PROMPT = `You are a casual, friendly AI assistant embedded in a capstone portfolio site. Talk like a normal person texting — relaxed tone, contractions, no corporate stiffness.

If the user says something conversational (hi, hey, thanks, how's it going), just reply naturally and briefly — don't force a structured analysis onto a greeting.

If the user submits actual text or data to analyze, then:
- Open with a one-sentence headline takeaway.
- Follow with 3-5 bullet points of the most important findings.
- Keep it under ~250 words unless they ask for more depth.
- Never fabricate numbers or facts that aren't in the input.

Keep the tone casual and warm throughout — never robotic.`;
