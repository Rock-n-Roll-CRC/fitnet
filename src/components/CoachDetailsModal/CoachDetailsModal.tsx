"use client";

import type { Tables } from "@/types/database";

import Link from "next/link";
import Image from "next/image";

import ConnectButton from "@/components/ConnectButton/ConnectButton";
import BlockButton from "@/components/BlockButton/BlockButton";

import styles from "./CoachDetailsModal.module.scss";
import type { Session } from "next-auth";

export default function CoachDetailsModal({
  coach,
  session,
  blockedProfiles,
  onClose,
}: {
  coach: Tables<"profiles">;
  session: Session;
  blockedProfiles: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
  onClose: () => void;
}) {
  const initialIsBlocked = blockedProfiles.some(
    (blockedProfile) =>
      blockedProfile.blockerProfile.user_id === session.user.id &&
      blockedProfile.blockedProfile.user_id === coach.user_id,
  );

  return (
    <div className={styles["coach-details-modal"]}>
      <Image
        src={coach.avatar_url}
        alt={coach.full_name}
        width={30}
        height={30}
      />
      <p>Full Name: {coach.full_name}</p>
      <p>Age: {coach.age}</p>
      <p>Gender: {coach.gender}</p>
      <p>Phone Number: {coach.phone_number}</p>

      <button onClick={onClose}>Close</button>

      <Link href={`/profile/${coach.user_id}`}>Open Profile</Link>

      <ConnectButton profile={coach} onClose={onClose} />

      <BlockButton
        profile={coach}
        initialIsBlocked={initialIsBlocked}
        onClose={onClose}
      />
    </div>
  );
}
