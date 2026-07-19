import type { Metadata } from "next";
import { AppsDirectory } from "@/components/directories/AppsDirectory";
import { SPACE_APPS } from "@/lib/data/spaceApps";

export const metadata: Metadata = {
  title: "Best space apps & websites",
  description:
    "Hand-picked directory of the best astronomy and space apps and websites — sky map apps for iOS/Android, satellite trackers, launch trackers, simulators, data archives and communities.",
  alternates: { canonical: "/apps" },
};

export default function AppsPage() {
  return (
    <>
      <p className="eyebrow">directory</p>
      <h1>The best space apps &amp; websites</h1>
      <p className="sub">
        {SPACE_APPS.length} hand-picked tools the space community actually uses — sky-map apps for
        your phone, satellite and launch trackers, full universe simulators, and the archives the
        professionals work from.
      </p>
      <AppsDirectory />
    </>
  );
}
