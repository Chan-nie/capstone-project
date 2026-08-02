This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Tool: `getPageMetadata`

**Purpose:** When a user pastes text containing a URL, the model can call this tool to fetch the page's real title, description, and preview image — so the analysis is grounded in actual content instead of guessed.

**Schema (Zod, `src/lib/tools/getPageMetadata.ts`):**
| Field | Type | Description |
|---|---|---|
| `url` | `string` (URL) | Fully-qualified URL to fetch |

**Returns:** `{ url, title, description, image, siteName }` — all fields except `url` are nullable if the page doesn't have that meta tag.

**Error behavior:** Invalid URL or non-2xx fetch → thrown error → surfaced as a distinct `output-error` state in the UI. A page missing some meta tags is *not* an error — it returns nulls, which the card renders gracefully.

**Note on Gemini vs. AI SDK:** this app talks to Gemini directly (`@google/genai`) rather than the Vercel AI SDK, so the four tool states are hand-rolled SSE events (`tool-input-streaming`, `tool-input-available`, `tool-output-available`, `tool-output-error`) instead of AI SDK's built-in `ToolUIPart` states — same concept, same state machine, different plumbing.