import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { googleEnabled, sessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Orrery to follow objects, missions and telescopes, and get launch alerts.",
  robots: { index: false },
};

export default async function SignInPage() {
  if (await sessionUser()) redirect("/account");
  return (
    <>
      <p className="eyebrow">account</p>
      <h1>Sign in to Orrery</h1>
      <p className="sub">
        Follow anything in the graph — objects, missions, telescopes, rockets — to get a personal
        feed, launch alerts, and a weekly sky digest.
      </p>
      <AuthForm googleEnabled={googleEnabled()} />
    </>
  );
}
