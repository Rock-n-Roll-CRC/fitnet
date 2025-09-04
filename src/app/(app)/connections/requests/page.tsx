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

  const isCoach = profile.role === "coach";

  const requests = isCoach
    ? await getPendingConnectionRequests(session.user.id)
    : await getSentPendingConnectionRequests(session.user.id);

  return <RequestsList isCoach={isCoach} requests={requests} />;
}
