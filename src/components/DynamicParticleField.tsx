"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type ParticleField from "@/components/ParticleField";

const DynamicParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

export default function ParticleFieldClient(
  props: ComponentProps<typeof ParticleField>
) {
  return <DynamicParticleField {...props} />;
}