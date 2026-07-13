import type { Metadata } from "next";
import { KindIndex } from "@/components/KindIndex";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Objects — planets, moons & deep sky",
  description:
    "Every world and deep-sky object in the Orrery catalog: planets, moons, dwarf planets, the complete Messier 110, and the brightest NGC showpieces.",
};

export default function ObjectsPage() {
  return (
    <KindIndex
      kinds={["object"]}
      eyebrow="Catalog"
      title="Planets, moons & deep sky"
      intro="The Solar System's worlds plus the complete Messier catalog and the finest NGC objects — each with facts, graph connections, and live sky data where it applies."
      groupOrder={["star", "planet", "dwarf-planet", "moon", "asteroid", "comet"]}
    />
  );
}
