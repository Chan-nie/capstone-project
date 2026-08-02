import { Type } from "@google/genai";

// 1. The Gemini Tool Declaration
export const getPageMetadataDeclaration = {
  name: "getPageMetadata",
  description: "Fetch metadata (title, description) for a given URL.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      url: {
        type: Type.STRING,
        description: "The URL to fetch metadata for",
      },
    },
    required: ["url"],
  },
};

// 2. The Execution Function
export async function getPageMetadata({ url }: { url: string }) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (url.includes("error")) {
    throw new Error("Failed to fetch metadata. Connection timed out.");
  }

  return {
    url,
    title: `Mock Title for ${url}`,
    description: "This is a structured response returned from the server-side tool.",
  };
}