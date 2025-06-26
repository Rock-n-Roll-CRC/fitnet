import { auth } from "@/services/auth";
import { getSavedProfiles } from "@/services/apiSavedProfiles";
import { getProfileByUserId } from "@/services/apiProfiles";
import SavedProfileItem from "@/components/SavedProfileItem/SavedProfileItem";

const Page = async () => {
  const session = await auth();

  if (!session) return;

  const userProfile = await getProfileByUserId(session.user.id);
  const savedProfiles = await getSavedProfiles(userProfile.id);

  return (
    <main>
      {savedProfiles.map(({ profile: savedProfile }) => (
        <SavedProfileItem key={savedProfile.id} savedProfile={savedProfile} />
      ))}
    </main>
  );
};

export default Page;
