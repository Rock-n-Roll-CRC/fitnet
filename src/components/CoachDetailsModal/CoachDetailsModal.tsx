"use client";

import type { Tables } from "@/types/database";

import Image from "next/image";

import { sendConnectionRequest } from "@/services/actions";

import styles from "./CoachDetailsModal.module.scss";
import Link from "next/link";

const CoachDetailsModal = ({
  coach,
  onClose,
}: {
  coach?: Tables<"profiles">;
  onClose: () => void;
}) => {
  async function handleSendConnectionRequest() {
    if (!coach) return;

    await sendConnectionRequest(coach.user_id);

    onClose();
  }

  if (!coach) return;

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

      <button onClick={() => void handleSendConnectionRequest()}>
        Connect
      </button>
    </div>
  );
};

export default CoachDetailsModal;
