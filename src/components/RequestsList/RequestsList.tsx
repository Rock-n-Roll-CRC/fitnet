"use client";

import type { Tables } from "@/types/database";

import { useOptimistic } from "react";

import RequestItem from "@/components/RequestItem/RequestItem";
import EmptyState from "@/components/EmptyState/EmptyState";

import EmptySVG from "@/assets/illustrations/empty.svg";

import styles from "./RequestsList.module.scss";

export default function RequestsList({
  receivedRequests,
  sentRequests,
}: {
  receivedRequests: (Tables<"connection_requests"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  })[];
  sentRequests: (Tables<"connection_requests"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  })[];
}) {
  const [optimisticReceivedRequests, removeReceivedRequest] = useOptimistic(
    receivedRequests,
    (state, id: string) => state.filter((request) => request.id !== id),
  );
  const [optimisticSentRequests, removeSentRequest] = useOptimistic(
    sentRequests,
    (state, id: string) => state.filter((request) => request.id !== id),
  );

  return optimisticReceivedRequests.length > 0 ||
    optimisticSentRequests.length > 0 ? (
    <div className={styles["requests-list"]}>
      <div className={styles["requests-list__container"]}>
        <h2 className={styles["requests-list__heading"]}>Received Requests</h2>

        <ul className={styles["requests-list__list"]}>
          {optimisticReceivedRequests.length > 0 ? (
            optimisticReceivedRequests.map((request, index) => (
              <RequestItem
                key={index}
                request={request}
                type={"received"}
                onRemove={removeReceivedRequest}
              />
            ))
          ) : (
            <EmptySVG className={styles["requests-list__empty"]} />
          )}
        </ul>
      </div>

      <div className={styles["requests-list__container"]}>
        <h2 className={styles["requests-list__heading"]}>Sent Requests</h2>

        <ul className={styles["requests-list__list"]}>
          {optimisticSentRequests.length > 0 ? (
            optimisticSentRequests.map((request, index) => (
              <RequestItem
                key={index}
                request={request}
                type={"sent"}
                onRemove={removeSentRequest}
              />
            ))
          ) : (
            <EmptySVG className={styles["requests-list__empty"]} />
          )}
        </ul>
      </div>
    </div>
  ) : (
    <EmptyState
      illustration={EmptySVG}
      heading={<>Looks like you have neither pending nor sent requests!</>}
      description={
        <>As you get or send connection requests, they will appear here.</>
      }
      ctaText={<>Start searching</>}
    />
  );
}
