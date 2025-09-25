import type { Tables } from "@/types/database";

import MailOutlineSVG from "@/assets/icons/mail-outline.svg";
import PersonOutlineSVG from "@/assets/icons/person-outline.svg";
import PersonAddOutlineSVG from "@/assets/icons/person-add-outline.svg";
import StarOutlineSVG from "@/assets/icons/star-outline.svg";
import MailSVG from "@/assets/icons/mail.svg";
import PersonSVG from "@/assets/icons/person.svg";
import PersonAddSVG from "@/assets/icons/person-add.svg";
import StarSVG from "@/assets/icons/star.svg";

import styles from "./Notification.module.scss";

const titles = new Map([
  ["NEW_MESSAGE", "Message Received"],
  ["REQUEST_RECEIVED", "Request Received"],
  ["REQUEST_ACCEPTED", "Request Accepted"],
  ["NEW_REVIEW", "Review Received"],
]);

const messages = new Map([
  ["NEW_MESSAGE", "{user} sent you a message."],
  ["REQUEST_RECEIVED", "{user} sent you a connection request."],
  ["REQUEST_ACCEPTED", "{user} accepted your connection request."],
  ["NEW_REVIEW", "{user} wrote a review about you."],
]);

const icons = new Map([
  ["NEW_MESSAGE", { outline: MailOutlineSVG, fill: MailSVG }],
  ["REQUEST_RECEIVED", { outline: PersonOutlineSVG, fill: PersonSVG }],
  ["REQUEST_ACCEPTED", { outline: PersonAddOutlineSVG, fill: PersonAddSVG }],
  ["NEW_REVIEW", { outline: StarOutlineSVG, fill: StarSVG }],
]);

export default function Notification({
  notification,
  numberOfMessages,
}: {
  notification: Tables<"notifications"> & { senderProfile: Tables<"profiles"> };
  numberOfMessages: number;
}) {
  const Icon = notification.is_read
    ? icons.get(notification.type)?.outline
    : icons.get(notification.type)?.fill;

  const notificationDate = new Date(notification.created_at);
  const currDate = new Date();
  const differenceInMin = Math.floor(
    (currDate.getTime() - notificationDate.getTime()) / (1000 * 60),
  );
  const differenceInHr = Math.floor(
    (currDate.getTime() - notificationDate.getTime()) / (1000 * 60 * 60),
  );
  const differenceInDays = Math.floor(
    Math.abs(currDate.getTime() - notificationDate.getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const differenceStr =
    differenceInMin < 1
      ? `just now`
      : differenceInHr < 1
        ? `${differenceInMin.toString()}m`
        : differenceInDays < 1
          ? `${differenceInHr.toString()}h`
          : differenceInDays < 7
            ? `${differenceInDays.toString()}d`
            : `${Math.floor(differenceInDays / 7).toString()}w`;

  if (!Icon) return;

  return (
    <li
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles.notification ?? ""} ${(!notification.is_read && styles["notification--unread"]) || ""}`}
    >
      <div className={styles.notification__container}>
        <div className={styles["notification__icon-wrapper"]}>
          <Icon className={styles.notification__icon} />
          {notification.type === "NEW_MESSAGE" && (
            <p className={styles["notification__message-count"]}>
              {numberOfMessages}
            </p>
          )}
        </div>

        <div className={styles.notification__body}>
          <p className={styles.notification__title}>
            {titles.get(notification.type)}
          </p>
          <p className={styles.notification__message}>
            {messages
              .get(notification.type)
              ?.replaceAll("{user}", notification.senderProfile.full_name)}
          </p>
        </div>
      </div>

      <p className={styles.notification__date}>{differenceStr}</p>
    </li>
  );
}
