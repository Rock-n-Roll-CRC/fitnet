import RequestsList from "@/components/RequestsList/RequestsList";

import { auth } from "@/services/auth";
import { getProfileByUserId } from "@/services/apiProfiles";
import {
  getPendingConnectionRequests,
  getSentPendingConnectionRequests,
} from "@/services/apiConnectionRequests";

export default async function Page() {
  const session = await auth();
  if (!session) return;

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return;

  const receivedRequests = await getPendingConnectionRequests(session.user.id);
  const sentRequests = await getSentPendingConnectionRequests(session.user.id);

  return (
    <RequestsList
      receivedRequests={receivedRequests}
      sentRequests={sentRequests}
    />
  );
}
