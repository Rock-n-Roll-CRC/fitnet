"use client";

import type { Tables } from "@/types/database";

import Image from "next/image";

import {
  acceptConnectionRequest,
  declineConnectionRequest,
  deleteConnectionRequest,
} from "@/services/actions";

import styles from "./RequestItem.module.scss";
import Link from "next/link";

const RequestItem = ({
  request,
  type,
}: {
  request: Tables<"connection_requests"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  };
  type: "sent" | "received";
}) => {
  const profile =
    type === "sent" ? request.receiverProfile : request.senderProfile;

  async function handleAcceptRequest() {
    await acceptConnectionRequest(request);
  }

  async function handleDeclineRequest() {
    await declineConnectionRequest(request);
  }
  async function handleDeleteRequest() {
    await deleteConnectionRequest(request);
  }

  return (
    <div>
      <Image
        src={profile.avatar_url}
        width={30}
        height={30}
        alt={profile.full_name}
      />
      <span>{profile.full_name}</span>
      <span>Invite sent {profile.created_at} ago</span>
      {type === "sent" ? (
        <>
          <button onClick={() => void handleDeleteRequest()}>Delete</button>
        </>
      ) : (
        <>
          <button onClick={() => void handleAcceptRequest()}>Accept</button>
          <button onClick={() => void handleDeclineRequest()}>Ignore</button>
          <Link href={`/profile/${profile.user_id}`}>Open Profile</Link>
        </>
      )}
    </div>
  );
};

export default RequestItem;
