import type { Tables } from "@/types/database";

import Tabs from "@/components/Tabs/Tabs";
import RequestItem from "@/components/RequestItem/RequestItem";

import { auth } from "@/services/auth";
import { getProfileByUserId } from "@/services/apiProfiles";
import { getSavedProfiles } from "@/services/apiSavedProfiles";
import {
  getPendingConnectionRequests,
  getSentPendingConnectionRequests,
} from "@/services/apiConnectionRequests";
import { getBlockedProfiles } from "@/services/apiBlockedProfiles";

import styles from "./page.module.scss";
import ProfilePreview from "@/components/ProfilePreview/ProfilePreview";
import FeelingLonelySVG from "@/assets/illustrations/feeling-lonely.svg";

export default async function Page({
  params,
}: {
  params: Promise<{ tab: "friends" | "requests" | "blocked" }>;
}) {
  const { tab } = await params;

  const session = await auth();

  if (!session) return;

  const profile = await getProfileByUserId(session.user.id);

  if (!profile) return;

  let savedProfiles:
    | (Tables<"saved_profiles"> & {
        saverProfile: Tables<"profiles"> & { ratings: Tables<"reviews">[] };
        savedProfile: Tables<"profiles"> & { ratings: Tables<"reviews">[] };
      })[]
    | undefined;
  let pendingRequests:
    | (Tables<"connection_requests"> & {
        senderProfile: Tables<"profiles">;
        receiverProfile: Tables<"profiles">;
      })[]
    | undefined;
  let sentRequests:
    | (Tables<"connection_requests"> & {
        senderProfile: Tables<"profiles">;
        receiverProfile: Tables<"profiles">;
      })[]
    | undefined;
  let blockedProfiles:
    | (Tables<"blocked_profiles"> & {
        blockerProfile: Tables<"profiles"> & { ratings: Tables<"reviews">[] };
        blockedProfile: Tables<"profiles"> & { ratings: Tables<"reviews">[] };
      })[]
    | undefined;

  switch (tab) {
    case "friends":
      savedProfiles = await getSavedProfiles(session.user.id);
      break;
    case "requests":
      pendingRequests = await getPendingConnectionRequests(session.user.id);
      sentRequests = await getSentPendingConnectionRequests(session.user.id);
      break;
    case "blocked":
      blockedProfiles = await getBlockedProfiles(session.user.id);
      break;
  }

  return (
    <main className={styles.main}>
      <Tabs
        currentTab={tab}
        tabs={[
          {
            label: "Friends",
            value: "friends",
            icon: "people",
          },
          {
            label: "Requests",
            value: "requests",
            icon: "person-add",
          },
          {
            label: "Blocked",
            value: "blocked",
            icon: "ban",
          },
        ]}
      />

      <div className={styles.main__content}>
        <ul className={styles["main__content-list"]}>
          {tab === "friends" ? (
            savedProfiles && savedProfiles.length > 0 ? (
              savedProfiles.map(({ saverProfile, savedProfile }) => (
                <ProfilePreview
                  key={savedProfile.user_id}
                  profile={
                    session.user.id === saverProfile.user_id
                      ? savedProfile
                      : saverProfile
                  }
                  type="saved"
                />
              ))
            ) : (
              <div className={styles["main__empty-state"]}>
                <FeelingLonelySVG
                  className={styles["main__empty-illustration"]}
                />

                <div className={styles["main__empty-content"]}>
                  <p className={styles["main__empty-heading"]}>
                    Looks like you have no friends!
                  </p>
                  <p className={styles["main__empty-description"]}>
                    As you add friends, they will appear here.
                  </p>
                </div>
              </div>
            )
          ) : null}

          {tab === "requests" ? (
            profile.role === "coach" ? (
              pendingRequests && pendingRequests.length > 0 ? (
                pendingRequests.map((request, index) => (
                  <RequestItem key={index} request={request} type="received" />
                ))
              ) : (
                <div className={styles["main__empty-state"]}>
                  <FeelingLonelySVG
                    className={styles["main__empty-illustration"]}
                  />

                  <div className={styles["main__empty-content"]}>
                    <p className={styles["main__empty-heading"]}>
                      Looks like you have no pending requests!
                    </p>
                    <p className={styles["main__empty-description"]}>
                      As you get sent connection requests, they will appear
                      here.
                    </p>
                  </div>
                </div>
              )
            ) : sentRequests && sentRequests.length > 0 ? (
              sentRequests.map((request, index) => (
                <RequestItem key={index} request={request} type="sent" />
              ))
            ) : (
              <div className={styles["main__empty-state"]}>
                <FeelingLonelySVG
                  className={styles["main__empty-illustration"]}
                />

                <div className={styles["main__empty-content"]}>
                  <p className={styles["main__empty-heading"]}>
                    Looks like you have no sent requests!
                  </p>
                  <p className={styles["main__empty-description"]}>
                    As you send connection requests, they will appear here.
                  </p>
                </div>
              </div>
            )
          ) : null}

          {tab === "blocked" ? (
            blockedProfiles && blockedProfiles.length > 0 ? (
              blockedProfiles.map(({ blockedProfile }) => (
                <ProfilePreview
                  key={blockedProfile.user_id}
                  profile={blockedProfile}
                  type="blocked"
                />
              ))
            ) : (
              <div className={styles["main__empty-state"]}>
                <FeelingLonelySVG
                  className={styles["main__empty-illustration"]}
                />

                <div className={styles["main__empty-content"]}>
                  <p className={styles["main__empty-heading"]}>
                    Looks like you have no blocked users!
                  </p>
                  <p className={styles["main__empty-description"]}>
                    As you block users, they will appear here.
                  </p>
                </div>
              </div>
            )
          ) : null}
        </ul>
      </div>
    </main>
  );
}
