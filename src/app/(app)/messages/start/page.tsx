import MessagesHeader from "@/components/MessagesHeader/MessagesHeader";
import ProfileChatItem from "@/components/ProfileChatItem/ProfileChatItem";
import EmptyState from "@/components/EmptyState/EmptyState";

import { auth } from "@/services/auth";
import { getSavedProfiles } from "@/services/apiSavedProfiles";

import OnlineCommunitySVG from "@/assets/illustrations/online-community.svg";

export default async function Page() {
  const session = await auth();

  if (!session) return;

  const savedProfiles = await getSavedProfiles(session.user.id);

  return (
    <>
      <MessagesHeader />

      {savedProfiles.length > 0 ? (
        savedProfiles.map(({ created_at, saverProfile, savedProfile }) => (
          <ProfileChatItem
            key={created_at}
            profile={
              session.user.id === saverProfile.user_id
                ? savedProfile
                : saverProfile
            }
          />
        ))
      ) : (
        <EmptyState
          illustration={OnlineCommunitySVG}
          heading={<>Looks like you have no friends!</>}
          description={<>As you add friends, they will appear here.</>}
        />
      )}
    </>
  );
}
