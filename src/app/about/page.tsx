import type { Metadata } from "next";
import HorizontalStory from "@/components/about/HorizontalStory";

export const metadata: Metadata = {
  title: "About",
  description: "The story so far — from MAHE Dubai to shipping this site.",
};

export default function AboutPage() {
  return <HorizontalStory />;
}