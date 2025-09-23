import { z } from "zod/v4";

import MapWrapper from "@/components/MapWrapper/MapWrapper";

import { auth } from "@/services/auth";
import { getProfileByUserId, getProfiles } from "@/services/apiProfiles";
import { getBlockedProfiles } from "@/services/apiBlockedProfiles";

import styles from "./page.module.scss";

const searchParamsSchema = z.object({
  distance: z.coerce.number().min(1).max(100).catch(50),
  gender: z.enum(["male", "female"]).catch("male"),
  minAge: z.coerce.number().min(18).max(99).catch(18),
  maxAge: z.coerce.number().min(19).max(100).catch(100),
});

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { distance, gender, minAge, maxAge } = await searchParams;

  const session = await auth();

  if (!session) return;

  const userProfile = await getProfileByUserId(session.user.id);

  if (!userProfile) return;

  const filters = searchParamsSchema.parse({
    distance,
    gender,
    minAge,
    maxAge,
  });

  const displayedProfiles = await getProfiles(
    userProfile.role === "client" ? "coach" : "client",
    filters,
  );
  const blockedProfiles = await getBlockedProfiles(session.user.id);

  return (
    <main className={styles.main}>
      <MapWrapper
        session={session}
        userProfile={userProfile}
        displayedProfiles={displayedProfiles}
        blockedProfiles={blockedProfiles}
        filters={filters}
      />
    </main>
  );
};

export default Page;
