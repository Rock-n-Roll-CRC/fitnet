import ProfileSetup from "@/components/ProfileSetup/ProfileSetup";

import { auth } from "@/services/auth";

export default async function Page() {
  const session = await auth();

  if (!session) return;

  return <ProfileSetup session={session} />;
}
