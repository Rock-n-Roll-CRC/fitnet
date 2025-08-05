import type { Tables } from "@/types/database";

import { getConnectionRequest } from "@/services/apiConnectionRequests";
import { getMessage } from "@/services/apiMessages";

import MailOutlineSVG from "@/assets/icons/mail-outline.svg";
import PersonOutlineSVG from "@/assets/icons/person-outline.svg";
import PersonAddOutlineSVG from "@/assets/icons/person-add-outline.svg";

import styles from "./Notification.module.scss";

const titles = new Map([
  ["NEW_MESSAGE", "Message Received"],
  ["REQUEST_RECEIVED", "Request Received"],
  ["REQUEST_ACCEPTED", "Request Accepted"],
]);

const messages = new Map([
  ["NEW_MESSAGE", "{user} sent you a message."],
  ["REQUEST_RECEIVED", "{user} sent you a connection request."],
  ["REQUEST_ACCEPTED", "{user} accepted your connection request."],
]);

const icons = new Map([
  ["NEW_MESSAGE", MailOutlineSVG],
  ["REQUEST_RECEIVED", PersonOutlineSVG],
  ["REQUEST_ACCEPTED", PersonAddOutlineSVG],
]);

export default async function Notification({
  notification,
  numberOfMessages,
}: {
  notification: Tables<"notifications">;
  numberOfMessages: number;
}) {
  const source =
    notification.type === "REQUEST_RECEIVED" ||
    notification.type === "REQUEST_ACCEPTED"
      ? await getConnectionRequest(notification.entity_id)
      : await getMessage(notification.entity_id);

  const user =
    notification.type === "REQUEST_RECEIVED" ||
    notification.type === "NEW_MESSAGE"
      ? source.senderProfile
      : source.receiverProfile;

  const Icon = icons.get(notification.type);

  const notificationDate = new Date(notification.created_at);
  const currDate = new Date();
  const differenceInHr = Math.floor(
    (currDate.getTime() - notificationDate.getTime()) / (1000 * 60 * 60),
  );
  const differenceInDays = Math.floor(
    Math.abs(currDate.getTime() - notificationDate.getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const differenceStr =
    differenceInHr < 1
      ? `just now`
      : differenceInDays < 1
        ? `${differenceInHr.toString()}h`
        : differenceInDays < 7
          ? `${differenceInDays.toString()}d`
          : `${Math.floor(differenceInDays / 7).toString()}w`;

  if (!Icon) return;

  return (
    <li className={styles.notification}>
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
              ?.replaceAll("{user}", user.full_name)}
          </p>
        </div>
      </div>

      <p className={styles.notification__date}>{differenceStr}</p>
    </li>
  );
}
