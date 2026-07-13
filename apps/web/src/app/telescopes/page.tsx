import type { Metadata } from "next";
import { KindIndex } from "@/components/KindIndex";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Telescopes & observatories",
  description:
    "The great telescopes in space and on the ground — JWST, Hubble, VLT, ALMA, Rubin, LIGO — with status, history, and live news for each.",
};

export default function TelescopesPage() {
  return (
    <KindIndex
      kinds={["telescope", "observatory"]}
      eyebrow="Catalog"
      title="Telescopes & observatories"
      intro="Humanity's eyes on the universe, in orbit and on mountaintops — from the Great Observatories to the giant survey machines now coming online."
      groupOrder={["space-telescope", "optical-observatory", "radio-observatory", "survey"]}
    />
  );
}
