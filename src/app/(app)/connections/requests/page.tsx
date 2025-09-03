import RequestItem from "@/components/RequestItem/RequestItem";
import EmptyState from "@/components/EmptyState/EmptyState";

import { auth } from "@/services/auth";
import { getProfileByUserId } from "@/services/apiProfiles";
import {
  getPendingConnectionRequests,
  getSentPendingConnectionRequests,
} from "@/services/apiConnectionRequests";

import FeelingLonelySVG from "@/assets/illustrations/feeling-lonely.svg";

export default async function Page() {
  const session = await auth();
  if (!session) return;

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return;

  const isCoach = profile.role === "coach";

  const requests = isCoach
    ? await getPendingConnectionRequests(session.user.id)
    : await getSentPendingConnectionRequests(session.user.id);

  return requests.length > 0 ? (
    requests.map((request, index) => (
      <RequestItem
        key={index}
        request={request}
        type={isCoach ? "received" : "sent"}
      />
    ))
  ) : (
    <EmptyState
      illustration={FeelingLonelySVG}
      heading={
        isCoach ? (
          <>Looks like you have no pending requests!</>
        ) : (
          <>Looks like you have no sent requests!</>
        )
      }
      description={
        isCoach ? (
          <>As you get sent connection requests, they will appear here.</>
        ) : (
          <>As you send connection requests, they will appear here.</>
        )
      }
    />
  );
}
