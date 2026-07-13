import type { Metadata } from "next";
import { KindIndex } from "@/components/KindIndex";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Missions — probes, rovers & crewed flights",
  description:
    "Famous space missions from Sputnik to Artemis: interplanetary probes, Mars rovers, sample returns, space stations, and the flights that made history.",
};

export default function MissionsPage() {
  return (
    <KindIndex
      kinds={["mission"]}
      eyebrow="Catalog"
      title="Missions"
      intro="Probes, rovers, landers, stations, and crewed flights — the machines that did the exploring, linked to the worlds they visited."
      groupOrder={["rover", "orbiter", "probe", "lander", "crewed", "space-station", "sample-return"]}
    />
  );
}
