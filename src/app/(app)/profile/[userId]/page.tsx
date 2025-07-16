import Image from "next/image";

import { auth } from "@/services/auth";
import { getProfileByUserId } from "@/services/apiProfiles";

import styles from "./page.module.scss";
import BlockButton from "@/components/BlockButton/BlockButton";
import { isBlocked } from "@/services/apiBlockedProfiles";
import ConnectButton from "@/components/ConnectButton/ConnectButton";
import { isConnected } from "@/services/apiSavedProfiles";

const Page = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const session = await auth();

  if (!session) return;

  const profile = await getProfileByUserId((await params).userId);

  if (!profile) return;

  const isProfileBlocked = await isBlocked(session.user.id, profile.user_id);
  const isProfileConnected = await isConnected(
    session.user.id,
    profile.user_id,
  );

  return (
    <main className={styles.main}>
      <div className={styles.profile}>
        <div className={styles["profile__top-container"]}>
          <div className={styles["profile__avatar-wrapper"]}>
            <Image
              src={profile.avatar_url}
              alt={profile.full_name}
              fill
              className={styles.profile__avatar}
            />
          </div>
          <p className={styles["profile__full-name"]}>{profile.full_name}</p>
        </div>

        <div className={styles["profile__bottom-container"]}>
          <p className={styles.profile__gender}>
            <span>Gender:</span> {profile.gender}
          </p>
          <p className={styles.profile__age}>
            <span>Age:</span> {profile.age}
          </p>
          <p className={styles["profile__phone-number"]}>
            {profile.phone_number}
          </p>
        </div>
      </div>

      {session.user.id !== profile.user_id && (
        <BlockButton isBlocked={isProfileBlocked} profile={profile} />
      )}

      {profile.role === "coach" &&
        session.user.id !== profile.user_id &&
        !isProfileConnected && <ConnectButton profile={profile} />}
    </main>
  );
};

export default Page;
