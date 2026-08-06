import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

if (!("randomUUID" in crypto)) {
  // @ts-expect-error polyfill for older jsdom
  crypto.randomUUID = () => Math.random().toString(36).slice(2);
}