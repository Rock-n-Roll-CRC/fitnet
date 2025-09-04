import { auth } from "@/services/auth";
import { getSavedProfiles } from "@/services/apiSavedProfiles";

import SavedProfilesList from "@/components/SavedProfilesList/SavedProfilesList";

export default async function Page() {
  const session = await auth();
  if (!session) return;

  const savedProfiles = await getSavedProfiles(session.user.id);

  return <SavedProfilesList session={session} savedProfiles={savedProfiles} />;
}
