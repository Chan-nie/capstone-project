# Buttons with a Brain — FE-AA1

A reusable `ActionButton` that carries its own lifecycle: idle → hover/focus →
loading → success/error → back to idle. Built for reuse as the "Send" button
in the capstone chat, but generic enough for save/deploy/generate actions too.

## Files

- `ActionButton.tsx` + `ActionButton.module.css` — the component, for dropping
  into the Next.js capstone project.
- `page.tsx` — a demo page wiring it to a fake async call (700–1600ms delay,
  20% failure rate) with two buttons sharing the same motion language.
- `standalone.html` — the same thing as one dependency-free file, in case you
  want a quick preview or a separate GitHub Pages deploy without touching the
  Next.js app.

## States covered

idle, hover/focus (`:hover`, `:focus-visible`), pressed (`:active`), loading,
success, error, and disabled — six explicit states, one bonus.

## Duration & easing choices

- **Hover/press (120–150ms):** fast because it's confirming a gesture that
  already happened — a click or a mouse-over. The eye expects near-instant
  confirmation here.
- **Idle → loading (320ms, `cubic-bezier(0.4,0,0.2,1)` on width, `ease` on
  color):** slower, because it's introducing new information — a spinner
  appearing, the button narrowing to a circle. A snap here would read as a
  glitch, not a deliberate state.
- **Success (springy `cubic-bezier(0.34,1.56,0.64,1)` overshoot on the
  checkmark, slight delay after the spinner fades):** success is a small
  reward, so a touch of bounce makes it feel like an acknowledgment rather
  than a status update.
- **Error (400ms shake, `cubic-bezier(0.36,0.07,0.19,0.97)`):** short and
  sharp so it registers as "something's wrong" quickly, then gets out of the
  way. It animates the inner content layer, not the button itself, so it
  never fights the button's own hover/press transform.
- **Only `transform`, `opacity`, and color animate** on the compositor path.
  The one deliberate exception is `min-width`, which changes when the button
  narrows from a labeled pill to a circular spinner — this is a genuine
  layout property, but it's scoped to the button's own box and doesn't
  trigger reflow anywhere else on the page, so the trade-off felt worth it
  for the "shrink to fit" effect the brief asks for.

## Interruptibility

Each click gets an incrementing `callId`. If a resolution/rejection comes
back for a stale call (shouldn't normally happen since the button disables
itself during loading, but this guards against edge cases), it's ignored.
Repeated errors re-trigger the shake by forcing a reflow (HTML version) or by
remounting the shake wrapper via a React `key` (TSX version), since CSS
won't restart an already-applied animation on its own.

## Accessibility

- Visible focus ring via `:focus-visible` (not `:focus`, so it doesn't show
  on mouse clicks).
- `aria-live="polite"` + `aria-busy` on the button so screen readers announce
  label changes (Send → Sending → Sent/Retry) without needing extra markup.
- `prefers-reduced-motion: reduce` removes the hover lift, success bounce,
  spinner rotation, and error shake — but never removes the feedback itself.
  Color and label changes always still happen; the spinner switches to a
  slow opacity pulse instead of spinning, and state transitions crossfade
  quickly instead of sliding.

## To integrate into the capstone

1. Copy `ActionButton.tsx` and `ActionButton.module.css` into your
   `components/` folder.
2. Swap the placeholder hex values at the top of the CSS file for your real
   Rose Quartz / Serenity tokens.
3. Replace the fake `onAction` in your chat's send button with your actual
   SSE call — `onAction` just needs to return a `Promise` that resolves on
   success and rejects on failure, so it drops straight into your existing
   streaming logic (resolve after the stream completes, reject on stream
   error).
4. Deploy with your existing Vercel pipeline for the live URL.

## To preview immediately

Just open `standalone.html` in a browser — no build step, no dependencies.