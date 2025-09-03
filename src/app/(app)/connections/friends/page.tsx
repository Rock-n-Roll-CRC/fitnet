import ProfilePreview from "@/components/ProfilePreview/ProfilePreview";
import EmptyState from "@/components/EmptyState/EmptyState";

import { auth } from "@/services/auth";
import { getSavedProfiles } from "@/services/apiSavedProfiles";

import FeelingLonelySVG from "@/assets/illustrations/feeling-lonely.svg";

export default async function Page() {
  const session = await auth();
  if (!session) return;

  const savedProfiles = await getSavedProfiles(session.user.id);

  return savedProfiles.length > 0 ? (
    savedProfiles.map(({ saverProfile, savedProfile }) => (
      <ProfilePreview
        key={savedProfile.user_id}
        profile={
          session.user.id === saverProfile.user_id ? savedProfile : saverProfile
        }
        type="saved"
      />
    ))
  ) : (
    <EmptyState
      illustration={FeelingLonelySVG}
      heading={<>Looks like you have no friends!</>}
      description={<>As you add friends, they will appear here.</>}
    />
  );
}
