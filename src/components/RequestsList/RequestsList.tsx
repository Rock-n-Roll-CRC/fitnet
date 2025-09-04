"use client";

import type { Tables } from "@/types/database";

import { useOptimistic } from "react";

import RequestItem from "@/components/RequestItem/RequestItem";
import EmptyState from "@/components/EmptyState/EmptyState";

import EmptySVG from "@/assets/illustrations/empty.svg";

export default function RequestsList({
  isCoach,
  requests,
}: {
  isCoach: boolean;
  requests: (Tables<"connection_requests"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  })[];
}) {
  const [optimisticRequests, removeRequest] = useOptimistic(
    requests,
    (state, id: string) => state.filter((request) => request.id !== id),
  );

  return optimisticRequests.length > 0 ? (
    optimisticRequests.map((request, index) => (
      <RequestItem
        key={index}
        request={request}
        type={isCoach ? "received" : "sent"}
        onRemove={removeRequest}
      />
    ))
  ) : (
    <EmptyState
      illustration={EmptySVG}
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
      ctaText={<>Start searching</>}
    />
  );
}
