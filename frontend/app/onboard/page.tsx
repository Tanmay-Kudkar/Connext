import { redirect } from "next/navigation";
import { getMe, serverApi } from "@/lib/server-api";
import { OnboardForm } from "@/components/auth/OnboardForm";
import type { Community } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function OnboardPage() {
  const me = await getMe();
  if (!me) redirect("/");
  const data = await serverApi<{ communities: Community[] }>("/api/communities");
  return <OnboardForm communities={data.communities} />;
}
