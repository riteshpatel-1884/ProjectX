import { syncUserWithDB } from "@/lib/syncUser";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  await syncUserWithDB();

  // Optional: collect extra data here
  redirect("/dashboard");
}
