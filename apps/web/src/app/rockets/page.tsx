import type { Metadata } from "next";
import { KindIndex } from "@/components/KindIndex";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rockets — launch vehicles past & present",
  description:
    "Launch vehicles from Saturn V to Starship: today's fleet and the icons that came before, linked to every upcoming launch they fly.",
};

export default function RocketsPage() {
  return (
    <KindIndex
      kinds={["vehicle"]}
      eyebrow="Catalog"
      title="Rockets"
      intro="The launchers — historic icons and the active fleet, each linked to its operator and to every upcoming flight in the Launch Center."
      groupOrder={["launch-vehicle"]}
    />
  );
}
