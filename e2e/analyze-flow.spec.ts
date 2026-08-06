import { test, expect } from "@playwright/test";

test("user can send a prompt and see a streamed reply", async ({ page }) => {
  await page.route("**/api/analyze", async (route) => {
    const body =
      `event: token\ndata: ${JSON.stringify({ text: "Revenue grew 12% year over year." })}\n\n` +
      `event: done\ndata: {}\n\n`;
    await route.fulfill({ status: 200, contentType: "text/event-stream", body });
  });

  await page.goto("/ai-analysis");

  await page.getByPlaceholder(/paste text to analyze/i).fill("Q3 revenue grew 12% YoY.");
  await page.getByRole("button", { name: /^send$/i }).click();

  await expect(page.getByText(/revenue grew 12% year over year/i)).toBeVisible({ timeout: 10000 });
});