import type { Metadata } from "next";
import { MissionBuilder } from "@/components/builder/MissionBuilder";

export const metadata: Metadata = {
  title: "Mission Builder — design your own satellite",
  description:
    "Name a satellite, pick a destination and instruments, and get a unique generated mission patch, a real-physics engineering readout, and NASA archive images for your mission's name.",
  alternates: { canonical: "/mission-builder" },
};

export default function MissionBuilderPage() {
  return (
    <>
      <p className="eyebrow">play · learn</p>
      <h1>Mission Builder</h1>
      <p className="sub">
        Design your own satellite: name it, choose where it flies and what it carries. You get a
        one-of-a-kind mission patch, an honest engineering readout (real transfer Δv, the rocket
        equation, a launch-vehicle match) — and NASA&apos;s archive searched for your mission&apos;s name.
      </p>
      <MissionBuilder />
    </>
  );
}
