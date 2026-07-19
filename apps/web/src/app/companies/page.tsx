import type { Metadata } from "next";
import { CompaniesDirectory } from "@/components/directories/CompaniesDirectory";
import { SPACE_ORGS } from "@/lib/data/companies";

export const metadata: Metadata = {
  title: "Space agencies & companies of the world",
  description:
    "Directory of the world's space organizations — NASA, ESA, ISRO, SpaceX and dozens more agencies, launch providers and manufacturers from every spacefaring nation, with what each one does.",
  alternates: { canonical: "/companies" },
};

export default function CompaniesPage() {
  return (
    <>
      <p className="eyebrow">directory</p>
      <h1>Space agencies &amp; companies of the world</h1>
      <p className="sub">
        {SPACE_ORGS.length} organizations across every spacefaring nation — from the agencies that
        landed on the Moon to the startups 3D-printing rockets. Filter by country or what they do.
      </p>
      <CompaniesDirectory />
    </>
  );
}
