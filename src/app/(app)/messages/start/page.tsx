import ProfileChatItem from "@/components/ProfileChatItem/ProfileChatItem";

import { auth } from "@/services/auth";
import { getSavedProfiles } from "@/services/apiSavedProfiles";

export default async function Page() {
  const session = await auth();

  if (!session) return;

  const savedProfiles = await getSavedProfiles(session.user.id);

  return (
    <>
      {savedProfiles.map(({ created_at, saverProfile, savedProfile }) => (
        <ProfileChatItem
          key={created_at}
          profile={
            session.user.id === saverProfile.user_id
              ? savedProfile
              : saverProfile
          }
        />
      ))}
    </>
  );
}
