import type { Tables } from "@/types/database";

import Tabs from "@/components/Tabs/Tabs";
import ProfileItem from "@/components/ProfileItem/ProfileItem";
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
        saverProfile: Tables<"profiles">;
        savedProfile: Tables<"profiles">;
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
        blockerProfile: Tables<"profiles">;
        blockedProfile: Tables<"profiles">;
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
        {tab === "friends" &&
          savedProfiles?.map(({ created_at, saverProfile, savedProfile }) => (
            <ProfileItem
              key={profile.user_id}
              profile={
                session.user.id === saverProfile.user_id
                  ? savedProfile
                  : saverProfile
              }
              date={created_at}
              type="saved"
            />
          ))}

        {tab === "requests"
          ? profile.role === "coach"
            ? pendingRequests?.map((request, index) => (
                <RequestItem key={index} request={request} type="received" />
              ))
            : sentRequests?.map((request, index) => (
                <RequestItem key={index} request={request} type="sent" />
              ))
          : null}

        {tab === "blocked" &&
          blockedProfiles?.map(({ created_at, blockedProfile }) => (
            <ProfileItem
              key={profile.user_id}
              profile={blockedProfile}
              date={created_at}
              type="blocked"
            />
          ))}
      </div>
    </main>
  );
}
